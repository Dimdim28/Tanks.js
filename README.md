## Tanks.js
***
Помимо этой работы в качестве курсовой, учавствовал в создании https://github.com/kreslavskiy/graphs и в созданных ишьюс в  https://github.com/MytsV/pixel-toons-editor рефакторил код

***
Control:

WSAD -  move,  Enter - shoot;

![image](https://user-images.githubusercontent.com/89345760/169092489-1d5913c2-0c77-4c1d-86bf-bc7b1f1779cd.png)


Written in pure javascript, tanks is an endless game with a scoring system and vehicle selection.
In the game, you can choose one of five types of equipment, each of which has its own advantages and disadvantages.
This game has an interesting feature:
at first glance, it seems very difficult, but if you understand the weakness of the enemies (which I hinted at above), then the game will become very simple
![image](https://user-images.githubusercontent.com/89345760/169100369-a407e7f7-2994-4157-8c49-c11375ebc850.png)

In each round, you choose a technique, after which 4 enemies will spawn along the edges of the screen, which you must destroy. After the destruction of all enemies or after the destruction of the player, the game will offer to choose a new technique, taking into account the number of available points.

![image](https://user-images.githubusercontent.com/89345760/169093447-45f622d4-6a6c-4683-8d6c-49677670b907.png)

Enemies move in a spiral along the edge of the screen until they are in line with it. When turning, they will open fire if they have managed to reload the cannon by that time.
They will collide with the player, turning at him when they are level and shooting. Remember that enemies can damage you not only with bullets, but also with a collision.

![image](https://user-images.githubusercontent.com/89345760/169100111-c487320c-f816-49a1-85d3-4b6267e55498.png)

 
 The game looks good on both PC and smartphones and tablets, but I didn't add phone controls to the game as it would be too hard to play at such a fast pace.
 
![image](https://user-images.githubusercontent.com/89345760/169095962-1a1c847f-250e-4b5a-9456-d4c3e70c7365.png)

Added music sounds and voice acting for some events to the game.

![image](https://user-images.githubusercontent.com/89345760/169101280-673de4b4-728e-4db3-a3ca-9a5784238045.png)

It is possible to add power-ups such as a shield or acceleration for the player to the game store, the sound folder even has everything you need for this, but I'm still thinking about whether this should be done.

![image](https://user-images.githubusercontent.com/89345760/169102358-5b2c74d3-9075-4485-a61b-6caa7b6bff0b.png)

For those who will use the game code:

All characteristics are placed in the characteristics.js file, you can always change the pace of the game or its complexity,

In the code, everything is broken down into functions and classes so that you can quite easily change the game or add new mechanics.
