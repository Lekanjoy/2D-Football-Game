 ## 2D Football Game with Autoregressive Language Model

This repository contains the code for a football game built using the HTML5 canvas. The game is played on a virtual football field, and the user controls the movement of the football using arrow keys or on-screen buttons. The objective of the game is to score goals by kicking the football into the opponent's goalpost.

### Prerequisites

To run the game, you will need:

- A modern web browser (e.g., Chrome, Firefox, Safari)
- An internet connection

### Instructions

To play the game, follow these steps:

1. Open the `index.html` file in your web browser.
2. Use the arrow keys or on-screen buttons to move the football.
3. Try to score goals by kicking the football into the opponent's goalpost.
4. The game ends when one team scores 5 goals.

### Code Overview

The code for the football game is written in JavaScript and HTML. The main components of the code are:

- The `canvas` element, which represents the football field.
- The `ctx` object, which is used to draw on the canvas.
- The `football` object, which represents the football.
- The `goalPosts` array, which represents the goalposts.
- The `scores` array, which stores the scores of the two teams.
- The `updateGame()` function, which updates the game state.
- The `drawGame()` function, which draws the game on the canvas.
- The `gameLoop()` function, which runs the game loop.

### Step-by-Step Explanation

Here is a step-by-step explanation of the code:

1. The `canvas` element is created and the `ctx` object is obtained.
2. The `footballField` object is created, which stores the dimensions of the football field.
3. The `goalPosts` array is created, which stores the positions of the goalposts.
4. The `leftPenaltyBox` and `rightPenaltyBox` objects are created, which store the positions of the penalty boxes.
5. The `leftPenaltySpot` and `rightPenaltySpot` objects are created, which store the positions of the penalty spots.
6. The `football` object is created, which stores the position and speed of the football.
7. The `scores` array is created, which:
- Initializes with empty arrays representing the scores of both teams `[0, 0]`
- Is updated whenever a goal is scored using the `checkGoal(team)` function.
8. The `gameLoop()` function is called repeatedly using the `requestAnimationFrame()` method.
9. Inside the `updateGame()` function, the following actions occur:
- The `football`'s position is updated based on its velocity.
- If the football hits any walls on the field , it resets the game for a goalkick places the ball back to the middle of the field.
- The `checkGoal(team)` function is called if the ball goes through the opponent goalpost (i.e., if `(ballX + ballRadius) > fieldWidth`).
10. After updating the game state, the `drawGame()` function is called.
11. In the `drawGame()` function, all elements on the canvas are cleared using `ctx.clearRect(0, 0, fieldWidth, fieldHeight)`. Then, the following items are drawn on the canvas:
- The football is drawn using `drawBall()`.
- The goalposts are drawn using `drawGoalPost()`.
- The scores are displayed at the top left corner of the screen using `showScores()`,
