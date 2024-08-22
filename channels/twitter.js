import { TwitterApi } from "twitter-api-v2";

const API_KEY = "wzXQCG4eZsDfW1ZwD5QpMIAIh";
const API_SECRET_KEY = "qs40kDuAGeFdjutFvmhGCUKwpCnkDSNi0siKhfpbRVmv4N2jto";
const Access_Token_Twitter =
  "984430852649218050-tUO5JVwfDQjVyf3phV5ACwLhNUOasai";
const Access_Token_Secret = "CcW9lYnpzx8F7eSDxCtLtjTD4MXWuWSO7lKRa7C7s1FTk";
// Replace these with your actual keys and tokens
const client = new TwitterApi({
  appKey: API_KEY,
  appSecret: API_SECRET_KEY,
  accessToken: Access_Token_Twitter,
  accessSecret: Access_Token_Secret,
});

const rwClient = client.readWrite;
const caption = `An unforgettable moment on the pitch today! 🏏 Just when you thought things couldn't get more exciting, Nadeem turns the tables by sending Naseem heading back to the pavilion with a classic run out! Truly proof of why cricket is called a game of uncertainty! 🙌 💥

Indeed, it's not every day you see a gear shift of this magnitude. A big shout-out to Nadeem for his exceptional bowling skills. No boundaries, no runs, just sheer strategic play was what it took to turn this game around! 👏🏽

If you thought Naseem's innings were over too soon – well, that's the name of the game! 😶 Sometimes one ball is all it takes to change the course of the match. Better luck next time, Naseem! 🍀

Remember, folks - it's not just about the four's and six's - it's about strategy, skills and a whole lot of surprises! Can't wait to see what the next match brings. 🤩🔥

#HeroicBowler #NadeemVictory #CricketGame #RunOut #NoRunsNoBoundries #OneBallGame #GameChanger #CricketFans #CricketLove #MasterPlan #BowlingSkills #FieldingWin #NeverMissABall`;
const twitterPosting = async () => {
  try {
    console.log("enter in service");

    await rwClient.v2.tweet("hleo");

    // console.log("Tweet posted:", tweet);
    return;
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      console.error("Error posting tweet:", error.response.data);
    } else {
      console.error("Error posting tweet:", error.message);
    }
    throw new Error(error.message);
  }
};
export { twitterPosting };
