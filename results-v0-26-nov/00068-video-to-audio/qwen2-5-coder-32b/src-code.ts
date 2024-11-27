import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';
import ffmpeg from 'npm:fluent-ffmpeg@2.0.18';

type CONFIG = {};
type INPUTS = { video_path: string, output_format?: 'mp3' | 'wav' | 'aac' | 'm4a', bitrate?: string };
type OUTPUT = { success: boolean, message: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { video_path, output_format = 'mp3', bitrate } = inputs;
    const audioFileName = `output.${output_format}`;
    
    return new Promise((resolve) => {
        let command = ffmpeg(video_path)
            .noVideo()
            .format(output_format);

        if (bitrate) {
            command = command.audioBitrate(bitrate);
        }

        command.save(audioFileName, async (err: Error, stdout: any, stderr: any) => {
            if (err) {
                resolve({ success: false, message: err.message });
            } else {
                try {
                    await localRustToolkitShinkaiSqliteQueryExecutor('INSERT INTO audio_files (video_path, output_file, format, bitrate) VALUES (?, ?, ?, ?)', [video_path, audioFileName, output_format, bitrate || 'default']);
                    resolve({ success: true, message: `Audio file created successfully and stored in database as ${audioFileName}` });
                } catch (dbErr) {
                    resolve({ success: false, message: `Audio file created but failed to store in database. Error: ${dbErr.message}` });
                }
            }
        });
    });
}