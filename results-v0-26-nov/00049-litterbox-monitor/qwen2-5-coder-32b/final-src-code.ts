
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import axios from 'npm:axios@1.6.2';
import cv from 'https://esm.sh/@techstark/opencv-js@4.5.1';

type CONFIG = {};
type INPUTS = { camera_feed: string, check_interval_minutes: number };
type OUTPUT = { cleanliness: string, fullness_percentage: number };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { camera_feed, check_interval_minutes } = inputs;

    // Function to analyze the image
    const analyzeImage = async (imageData: Uint8Array): Promise<{ cleanliness: string, fullness_percentage: number }> => {
        cv.onRuntimeInitialized = () => {
            const img = cv.imdecode(cv.matFromImageData(imageData));

            // Convert image to grayscale
            const gray = new cv.Mat();
            cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);

            // Apply thresholding to detect solid particles (litter and waste)
            const _, binary = new cv.Mat();
            cv.threshold(gray, binary, 150, 255, cv.THRESH_BINARY);

            // Find contours of the detected areas
            const contours: any[] = [];
            const hierarchy = new cv.Mat();
            cv.findContours(binary, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

            // Calculate total area and detected solid particles area
            const totalArea = img.size().width * img.size().height;
            let solidParticlesArea = 0;

            for (let i = 0; i < contours.length; i++) {
                solidParticlesArea += cv.contourArea(contours[i]);
            }

            // Calculate fullness percentage
            const fullness_percentage = (solidParticlesArea / totalArea) * 100;

            // Determine cleanliness based on fullness percentage
            let cleanliness: string;
            if (fullness_percentage < 20) {
                cleanliness = 'very clean';
            } else if (fullness_percentage < 50) {
                cleanliness = 'clean';
            } else if (fullness_percentage < 80) {
                cleanliness = 'moderately dirty';
            } else {
                cleanliness = 'dirty';
            }

            img.delete();
            gray.delete();
            binary.delete();
            contours.forEach(contour => contour.delete());
            hierarchy.delete();

            return { cleanliness, fullness_percentage };
        };

        // Trigger OpenCV initialization
        cv('onRuntimeInitialized', () => {});

        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ cleanliness: 'unknown', fullness_percentage: 0 });
            }, 100); // Simulate async behavior, replace with actual processing logic
        });
    };

    const fetchImage = async (url: string): Promise<Uint8Array> => {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return new Uint8Array(response.data);
    };

    // Fetch and analyze the image
    const imageData = await fetchImage(camera_feed);
    const result = await analyzeImage(imageData);

    // Schedule next check
    setTimeout(() => run(config, inputs), check_interval_minutes * 60 * 1000);

    return result;
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"camera_feed":"http://camera.local/litterbox","check_interval_minutes":30}')
  
  try {
    const program_result = await run({}, {"camera_feed":"http://camera.local/litterbox","check_interval_minutes":30});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

