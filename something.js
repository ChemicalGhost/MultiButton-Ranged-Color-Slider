// Function to check collision between two balls
function checkCollision(ball1, ball2) {
  const distance = Math.sqrt(
    (ball2.position.x - ball1.position.x) ** 2 +
      (ball2.position.y - ball1.position.y) ** 2
  );

  return distance < ball1.radius + ball2.radius;
}

function physxSim() {
  // ... (existing code)

  // Check for collisions with canvas boundaries
  if (ball.position.x < 0.0 + ball.radius / cScale) {
    ball.position.x = 0 + ball.radius / cScale;
    ball.velocity.x = -ball.velocity.x * restitution;
  }
  // ... (other boundary checks)

  // Check for collisions with other balls
  if (checkCollision(ball, ball2)) {
    // Handle collision between ball and ball2
    // Example: Swap velocities for a simple elastic collision
    const tempVelocity = { x: ball.velocity.x, y: ball.velocity.y };
    ball.velocity.x = ball2.velocity.x;
    ball.velocity.y = ball2.velocity.y;
    ball2.velocity.x = tempVelocity.x;
    ball2.velocity.y = tempVelocity.y;
  }

  // ... (other ball-to-ball collision checks for additional balls)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
addEventListener("mousedown", (e) => {
  const mouseX = e.clientX - canvas.getBoundingClientRect().left;
  const mouseY = -e.clientY - canvas.getBoundingClientRect().top;

  const distanceFromMousePointer = Math.sqrt(
    (mouseX - cX(ball)) ** 2 + (mouseY - cY(ball)) ** 2
  );

  if (distanceFromMousePointer < ball.radius) {
    isDragging = true;
    
    // Store initial position in simulation coordinates
    dragStartX = mouseX / cScale;
    dragStartY = mouseY / cScale;
  }

  addEventListener("mousemove", function moveUpdate(e) {
    if (isDragging) {
      gravity.x = 0;
      gravity.y = 0;
      timeStep_DT = 0;

      // Update ball position based on mouse coordinates
      ball.position.x =
        (e.clientX - canvas.getBoundingClientRect().left) / cScale;
      ball.position.y =
        (canvasHeight - e.clientY + canvas.getBoundingClientRect().top) /
        cScale;
    }
  });
});

addEventListener("mouseup", function moveUpdate(e) {
  if (isDragging) {
    isDragging = false;

    // Calculate the velocity based on the difference in positions
    const dragEndX = (e.clientX - canvas.getBoundingClientRect().left) / cScale;
    const dragEndY =
      (canvasHeight - e.clientY + canvas.getBoundingClientRect().top) / cScale;

    ball.velocity.x = (dragEndX - dragStartX) / timeStep_DT;
    ball.velocity.y = (dragEndY - dragStartY) / timeStep_DT;
  }
});
