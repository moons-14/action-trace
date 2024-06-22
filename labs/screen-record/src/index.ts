import { recorder } from 'aperture';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';


const recordAndSave = async () => {
    const options = {
        fps: 30
    };

    await recorder.startRecording(options);
    await recorder.isFileReady;

    await setTimeout(15 * 60 * 1000);

    const fp = await recorder.stopRecording();

    await fs.renameSync(fp, `./videos/${new Date().toISOString().replace(/:/g, '-')}.mp4`);
}

const main = async () => {
    while (true) {
        await recordAndSave();
    }
}

main()