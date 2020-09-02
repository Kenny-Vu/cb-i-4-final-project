# cb-i-4-final-project

I am making a chat/game app for

## Controls:

- W,A,S,D keys to move the character
- Spacebar when near the NPC(Non-playable character) to interact
- Click on the buttons below in the action bar to logout, like or play music.

## Main features:

- movable characters for users
- walking animation for the player sprite
- collision on NPC and bar table
- dynamic camera that follows the player
- chat app in inside the game, emojis, emotes?
- There is one NPC you can interact with.
- temp account (no signup required)
- room ids
- Music can be played
- distance between affects determines if the messages appear or not. (Just found out that it becomes laggy when there are too many messages in the chat...Needs fixing)

---

## Additional Features (Streatch goals):

- voice clips?
- character creation screen
- purchaseable wearables for characters
- mini-games
- pets that follow them
- consumables you can buy that will have effect in the chat

## important:

- For now, the chat component on uses the state hook. It will be refactored to use redux just like the game component.
- Some code from the server sends arrays rather than objects. The code will be changed to send only objects to make it easier for redux.
- the code that causes lags in the chat component has been commented out for now.

## Progress after 2 weeks:

![Demo](/assets/demo3.gif)

\* the character spritesheet asset belongs to Drew Conley and I am only using it as a temporary asset. The plan is to replace it with a homemade spritesheet.

\* music from Abstraction. Check out the album here: https://abstractionmusic.bandcamp.com/album/three-red-hearts
