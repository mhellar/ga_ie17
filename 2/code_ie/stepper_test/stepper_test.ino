/* YourDuinoStarter Example: 2 Stepper Motors
 - WHAT IT DOES: Runs 2 28BYJ-48 stepper motors with AccelStepper Library
 - Motors accelerate and decelerate simultaneously in opposite rotations
 - SEE the comments after "//" on each line below
 -  Derived from example code by Mike McCauley
 -  modified by Celem for single stepper
 -  modified by lowres for two steppers 
 NOTE: This may not run 2 motors from USB. 
       May need separate +5 Supply for motors
 - CONNECTIONS: See Pin definitions below

 - V1.01 11/30/2013
   Questions: terry@yourduino.com */

/*-----( Import needed libraries )-----*/
#include <AccelStepper.h>
/*-----( Declare Constants and Pin Numbers )-----*/
#define FULLSTEP 4
#define HALFSTEP 8
// motor pins
#define motorPin1  12     // Blue   - 28BYJ48 pin 1
#define motorPin2  13     // Pink   - 28BYJ48 pin 2
#define motorPin3  14     // Yellow - 28BYJ48 pin 3
#define motorPin4  15     // Orange - 28BYJ48 pin 4
                        // Red    - 28BYJ48 pin 5 (VCC)
                        
/*-----( Declare objects )-----*/
// NOTE: The sequence 1-3-2-4 is required for proper sequencing of 28BYJ48
AccelStepper stepper1(HALFSTEP, motorPin1, motorPin3, motorPin2, motorPin4);

/*-----( Declare Variables )-----*/
//none

void setup()   /****** SETUP: RUNS ONCE ******/
{
  stepper1.setMaxSpeed(1000.0);
  stepper1.setAcceleration(50.0);
  stepper1.setSpeed(200);
  stepper1.moveTo(2048);  // 1 revolution 
  

}//--(end setup )---


void loop()   /****** LOOP: RUNS CONSTANTLY ******/
{
  //Change direction at the limits
  if (stepper1.distanceToGo() == 0) 
    stepper1.moveTo(-stepper1.currentPosition());
  
  stepper1.run();

}//--(end main loop )---

/*-----( Declare User-written Functions )-----*/
//none
//*********( THE END )***********
/* ( THE END ) */
