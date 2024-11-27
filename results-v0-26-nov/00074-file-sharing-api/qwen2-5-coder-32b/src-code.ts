import { Application, Router } from 'npm:oak@12.5.0';
import * as path from 'https://deno.land/std@0.198.0/path/mod.ts';
import { serveFile } from "https://deno.land/std@0.198.0/http/file_server.ts";
import { shinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { storage_path: string, allowed_file_types: string[], max_file_size_mb: number };
type OUTPUT = {};

const createApiForFileSharing = async (storagePath: string, allowedFileTypes: string[], maxFileSizeMB: number) => {
    const app = new Application();
    const router = new Router();

    // Ensure storage path exists
    await Deno.mkdir(storagePath, { recursive: true });

    // Database setup for file metadata
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            size INTEGER NOT NULL,
            path TEXT NOT NULL,
            uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await shinkaiSqliteQueryExecutor(createTableQuery);

    // File upload endpoint
    router.post('/upload', async (context) => {
        const body = context.request.body({ type: 'form-data' });
        const formData = await body.value.read();
        
        for (const [key, value] of formData.entries()) {
            if (value instanceof Deno.FileInfo) continue;
            const file: any = value;
            const filePath = path.join(storagePath, file.filename);

            // Check file type and size
            if (!allowedFileTypes.includes(path.extname(file.filename).toLowerCase())) {
                context.response.status = 400;
                context.response.body = { error: 'Invalid file type' };
                return;
            }
            if (file.size > maxFileSizeMB * 1024 * 1024) {
                context.response.status = 400;
                context.response.body = { error: 'File size exceeds limit' };
                return;
            }

            await Deno.copyFile(file.originalname, filePath);

            // Save file metadata to database
            const insertQuery = `
                INSERT INTO files (name, type, size, path) VALUES (?, ?, ?, ?);
            `;
            await shinkaiSqliteQueryExecutor(insertQuery, [file.filename, file.type, file.size, filePath]);

            context.response.body = { message: 'File uploaded successfully' };
        }
    });

    // File download endpoint
    router.get('/files/:filename', async (context) => {
        const filename = context.params?.filename;
        if (!filename) {
            context.response.status = 400;
            context.response.body = { error: 'Filename is required' };
            return;
        }

        const filePath = path.join(storagePath, filename);
        try {
            await serveFile(context.request, filePath);
        } catch (error) {
            context.response.status = 404;
            context.response.body = { error: 'File not found' };
        }
    });

    // File search endpoint
    router.get('/search', async (context) => {
        const query = context.url.searchParams.get('q');
        if (!query) {
            context.response.status = 400;
            context.response.body = { error: 'Search query is required' };
            return;
        }

        const searchQuery = `
            SELECT * FROM files WHERE name LIKE ?;
        `;
        const results = await shinkaiSqliteQueryExecutor(searchQuery, [`%${query}%`]);
        
        context.response.body = results;
    });

    app.use(router.routes());
    app.use(router.allowedMethods());

    return app;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { storage_path, allowed_file_types, max_file_size_mb } = inputs;
    const app = await createApiForFileSharing(storage_path, allowed_file_types, max_file_size_mb);
    
    // Start the server
    await app.listen({ port: 8000 });

    return {};
}