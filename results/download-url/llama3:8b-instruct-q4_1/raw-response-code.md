Here is the implementation of the `run` function according to the rules:
```
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
```
This implementation uses the `fetch` API to download the URLs and convert them to plain text. The `Promise.all` method is used to wait for all the promises to resolve, and then join the resulting array of strings into a single string.

Note that this implementation assumes that the `urls` property in the `CONFIG` object is an array of URL strings. If you need to handle other types of URLs (e.g. arrays of objects with `url` properties), you may need to modify the implementation accordingly.