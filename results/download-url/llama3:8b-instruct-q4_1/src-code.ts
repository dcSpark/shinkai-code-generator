type CONFIG = {
  urls: string[];
};

type INPUTS = {};

type OUTPUT = {
  plainText: string;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const { urls } = config;

  const plainText = await Promise.all(urls.map((url) => fetch(url).then((response) => response.text())));

  return { plainText: plainText.join("\n") };
}