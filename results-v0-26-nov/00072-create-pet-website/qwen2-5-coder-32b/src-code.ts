import shinkaiSqliteQueryExecutor from 'npm:shinkai-sqlite-query-executor@1.0.0';

type CONFIG = {};
type INPUTS = { pet_name: string; pet_type: string; photos: string[] };
type OUTPUT = { success: boolean; message: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { pet_name, pet_type, photos } = inputs;

    // Create the HTML content for the website
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pet_name}'s Website</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
        img { max-width: 50%; margin: 10px; }
    </style>
</head>
<body>
    <h1>Welcome to ${pet_name}'s Website!</h1>
    <p>Meet ${pet_name}, a wonderful ${pet_type}.</p>
    <div>
        ${photos.map(photo => `<img src="${photo}" alt="${pet_name}">`).join('')}
    </div>
</body>
</html>
`;

    // Write the HTML content to a file
    const filePath = `./websites/${pet_name}_website.html`;
    try {
        await Deno.writeTextFile(filePath, htmlContent);
    } catch (error) {
        return { success: false, message: `Failed to create website file: ${error.message}` };
    }

    // Store the result in SQL
    const query = `
INSERT INTO pet_websites (pet_name, pet_type, photo_count, file_path)
VALUES (?, ?, ?, ?);
`;
    try {
        await shinkaiSqliteQueryExecutor(query, [pet_name, pet_type, photos.length, filePath]);
    } catch (error) {
        return { success: false, message: `Failed to store website info in SQL: ${error.message}` };
    }

    return { success: true, message: 'Website created and stored successfully' };
}