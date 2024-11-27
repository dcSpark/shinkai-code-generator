```typescript
import { execSync } from 'node:child_process';

type CONFIG = {};
type INPUTS = { url: string, quality?: 'highest' | 'lowest' | '1080p' | '720p' | '480p' | '360p' };
type OUTPUT = { filePath: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { url, quality } = inputs;
    let qualityOption = '';

    if (quality) {
        switch (quality) {
            case 'highest':
                qualityOption = '-f best';
                break;
            case 'lowest':
                qualityOption = '-f worst';
                break;
            default:
                qualityOption = `-f "bestvideo[height<=${parseInt(quality)}]+bestaudio/best[height<=${parseInt(quality)}]"`;
        }
    } else {
        qualityOption = '-f best'; // Default to highest quality
    }

    const fileName = `downloaded_video_${Date.now()}.mp4`;
    const command = `youtube-dl ${qualityOption} -o "${fileName}" "${url}"`;

    try {
        execSync(command, { stdio: 'inherit' });
        return { filePath: fileName };
    } catch (error) {
        throw new Error(`Error downloading video: ${error.message}`);
    }
}
```