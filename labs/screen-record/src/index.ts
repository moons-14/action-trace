import { recorder } from 'aperture';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';
import ffmpeg from 'fluent-ffmpeg';

const recordAndSave = async () => {
    const options = {
        fps: 30,
        hevc: "hevc"
    };

    await recorder.startRecording(options);
    await recorder.isFileReady;
    console.log(`Record will finish at ${new Date(Date.now() + 15 * 60 * 1000)}`);

    await setTimeout(15 * 60 * 1000);

    const fp = await recorder.stopRecording();
    const outputFilename = `./videos/${new Date().toISOString().replace(/:/g, '-')}.mp4`;

    // Compress the video using ffmpeg
    await new Promise<void>((resolve, reject) => {
        ffmpeg(fp)
            .videoCodec('libx264')
            .addOption('-crf', '28')
            .addOption('-preset', 'slow')
            .audioCodec('aac')
            .audioBitrate('128k')
            .on('end', () => {
                fs.unlinkSync(fp);
                resolve();
            })
            .on('error', (err: Error) => {
                console.error(`An error occurred: ${err.message}`);
                reject(err);
            })
            .save(outputFilename);
    });

    console.log(`Compressed video saved as ${outputFilename}`);
}

const main = async () => {
    while (true) {
        await recordAndSave();
    }
}

main()