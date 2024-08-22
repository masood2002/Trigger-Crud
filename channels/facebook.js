import axios from "axios";

const fbPosting = async (content, image) => {
  const url = "https://graph.facebook.com/v20.0/me/photos";
  const body = {
    url: image,
    caption: content,
    access_token:
      "EAAHeAoxheGQBO0ZA9zt9f9qsVCJZBoBZClzh98N8mMFnkV8eAT0iBijfJifv9Ecuce4EzWEA62kbfZCFZArqzyvZCphsE5tZAnGRZBeMEB0ZA8yMZCP2ZATj0NzwNKnqF0KZBOUNTW6u8EooWd1X1lusAbRCA6hJtEnFlowFitu5dZBt8YMGzN9PjOWXgRnRg3YxqgnudmZBSFpI69xAZAz5ZA28zowZD",
  };

  try {
    // console.log(body);
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log("helo 2 ");
    // console.log("API response:", response.data);
    console.log("Posted on Facebook");
    return;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
export { fbPosting };
