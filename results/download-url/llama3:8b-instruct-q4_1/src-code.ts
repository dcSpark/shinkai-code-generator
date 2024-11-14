type CONFIG = {};
type INPUTS = {
  urls: string[];
};
type OUTPUT = {
  texts: string[];
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const { urls } = inputs;

  const texts: string[] = await Promise.all(urls.map(async (url) => {
    const response = await fetch(url);
    return await response.text();
  }));

  return { texts };
}