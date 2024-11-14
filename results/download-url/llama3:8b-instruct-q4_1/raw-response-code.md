Here is the implementation of the task according to the rules provided:
```
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
```
This code defines a `run` function that takes a `config` object and an `inputs` object as arguments. The `inputs` object contains an array of URLs to download. The function uses the `fetch` API to fetch each URL, reads the response as plain text using the `text()` method, and returns an array of these texts.

Note that this implementation assumes that the URLs are publicly accessible and can be fetched without any authentication or additional headers. If your use case requires more advanced handling of URLs, you may need to modify the code accordingly.