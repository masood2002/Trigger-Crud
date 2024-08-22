import axios from "axios";

const igPosting = async (content, imageUrl) => {
  const getInstagramAccountId = async (pageId, accessToken) => {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v20.0/${pageId}`,
        {
          params: {
            fields: "instagram_business_account",
            access_token: accessToken,
          },
        }
      );

      const instagramAccountId = response.data.instagram_business_account.id;

      return instagramAccountId;
    } catch (error) {
      console.error(
        "Error fetching Instagram Account ID:",
        error.response ? error.response.data : error.message
      );
      return null;
    }
  };
  const addInstagramPost = async (instagramUserId, accessToken) => {
    const image = imageUrl;

    const caption = content;
    try {
      const mediaResponse = await axios.post(
        `https://graph.facebook.com/v20.0/${instagramUserId}/media`,
        {
          image_url: image,
          caption: caption,
          access_token: accessToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const creationId = mediaResponse.data.id;

      const publishResponse = await axios.post(
        `https://graph.facebook.com/v20.0/${instagramUserId}/media_publish`,
        {
          creation_id: creationId,
          access_token: accessToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Posted on Instagram");
      return;
    } catch (error) {
      console.error(
        "Error uploading to Instagram:",
        error.response ? error.response.data : error.message
      );
      throw new Error(error.message);
    }
  };

  // Example usage
  const pageId = "106853855657467"; // Replace with your Facebook Page ID
  const accessToken =
    "EAAHeAoxheGQBO0ZA9zt9f9qsVCJZBoBZClzh98N8mMFnkV8eAT0iBijfJifv9Ecuce4EzWEA62kbfZCFZArqzyvZCphsE5tZAnGRZBeMEB0ZA8yMZCP2ZATj0NzwNKnqF0KZBOUNTW6u8EooWd1X1lusAbRCA6hJtEnFlowFitu5dZBt8YMGzN9PjOWXgRnRg3YxqgnudmZBSFpI69xAZAz5ZA28zowZD";
  const instaId = await getInstagramAccountId(pageId, accessToken);

  await addInstagramPost(instaId, accessToken);
};

export { igPosting };
