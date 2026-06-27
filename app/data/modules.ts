export interface Module {
  slug: string;
  title: string;
  content: string;
}

export const modules: Module[] = [
  {
    slug: "wires",
    title: "Wires",
    content: `On the Subject of Wires

Wires are the lifeblood of electronics! Wait, no, electricity is the lifeblood. Wires are more like the arteries. The veins? No matter…

• A wire module can have 3–6 wires on it.
• Only the one correct wire needs to be cut to disarm the module.
• Wire ordering begins with the first on the top.

3 WIRES:
If there are no red wires, cut the second wire.
Otherwise, if the last wire is white, cut the last wire.
Otherwise, if there is more than one blue wire, cut the last blue wire.
Otherwise, cut the last wire.

4 WIRES:
If there is more than one red wire and the last digit of the serial number is odd, cut the last red wire.
Otherwise, if the last wire is yellow and there are no red wires, cut the first wire.
Otherwise, if there is exactly one blue wire, cut the first wire.
Otherwise, if there is more than one yellow wire, cut the last wire.
Otherwise, cut the second wire.

5 WIRES:
If the last wire is black and the last digit of the serial number is odd, cut the fourth wire.
Otherwise, if there is exactly one red wire and there is more than one yellow wire, cut the first wire.
Otherwise, if there are no black wires, cut the second wire.
Otherwise, cut the first wire.

6 WIRES:
If there are no yellow wires and the last digit of the serial number is odd, cut the third wire.
Otherwise, if there is exactly one yellow wire and there is more than one white wire, cut the fourth wire.
Otherwise, if there are no red wires, cut the last wire.
Otherwise, cut the fourth wire.`,
  },
  {
    slug: "the-button",
    title: "The Button",
    content: `On the Subject of The Button

You might think that a button telling you to press it is pretty straightforward. That's the kind of thinking that gets people exploded.

See Appendix A for indicator identification reference.
See Appendix B for battery identification reference.

Follow these rules in the order they are listed. Perform the first action that applies:

1. If the button is blue and the button says "Abort", hold the button and refer to "Releasing a Held Button".
2. If there is more than 1 battery on the bomb and the button says "Detonate", press and immediately release the button.
3. If the button is white and there is a lit indicator with label CAR, hold the button and refer to "Releasing a Held Button".
4. If there are more than 2 batteries on the bomb and there is a lit indicator with label FRK, press and immediately release the button.
5. If the button is yellow, hold the button and refer to "Releasing a Held Button".
6. If the button is red and the button says "Hold", press and immediately release the button.
7. If none of the above apply, hold the button and refer to "Releasing a Held Button".

RELEASING A HELD BUTTON:
If you start holding the button down, a colored strip will light up on the right side of the module. Based on its color, you must release the button at a specific point in time:

• Blue strip: release when the countdown timer has a 4 in any position.
• White strip: release when the countdown timer has a 1 in any position.
• Yellow strip: release when the countdown timer has a 5 in any position.
• Any other color strip: release when the countdown timer has a 1 in any position.`,
  },
  {
    slug: "keypads",
    title: "Keypads",
    content: `On the Subject of Keypads

I'm not sure what these symbols are, but I suspect they have something to do with occult.

• Only one column below has all four of the symbols from the keypad.
• Press the four buttons in the order their symbols appear from top to bottom within that column.

The six columns each contain 7 symbols. Find the column that contains all four symbols shown on your keypad, then press the buttons in the top-to-bottom order they appear in that column.

Column 1: Q, A, λ (lambda-like), ħ (h-bar), Ж (mirrored), ψ (psi-like), Ↄ (reversed C)
Column 2: Ϗ (dotted E), Q, Ↄ (reversed C), Ω (omega-like), ☆ (star outline), ψ (psi-like), ¿ (inv. question)
Column 3: © (copyright), ϡ (omega variant), Ω (omega), Ж, ვ (Georgian), λ (lambda), ☆ (star outline)
Column 4: б (b-like), ¶ (pilcrow), Ъ (hard sign), Ж (mirrored), Ж, ¿ (inv. question), ﻬ (Arabic-like)
Column 5: Ψ (psi), ﻬ (Arabic-like), Ъ (hard sign), C (with dot), ¶ (pilcrow), ვ (Georgian), ★ (star)
Column 6: б (b-like), Ϗ (dotted E), ✱ (asterisk), æ, Ψ (psi), И (Cyrillic), Ω

Note: Refer to the printed manual for exact symbol identification, as many symbols are visually similar.`,
  },
  {
    slug: "simon-says",
    title: "Simon Says",
    content: `On the Subject of Simon Says

This is like one of those toys you played with as a kid where you have to match the pattern that appears, except this one is a knockoff that was probably purchased at a dollar store.

1. One of the four colored buttons will flash.
2. Using the correct table below, press the button with the corresponding color.
3. The original button will flash, followed by another. Repeat this sequence in order using the color mapping.
4. The sequence will lengthen by one each time you correctly enter a sequence until the module is disarmed.

Button layout: Blue (top), Red (left), Yellow (right), Green (bottom).

IF THE SERIAL NUMBER CONTAINS A VOWEL:

              Red Flash   Blue Flash   Green Flash   Yellow Flash
No Strikes:   Blue        Red          Yellow        Green
1 Strike:     Yellow      Green        Blue          Red
2 Strikes:    Green       Red          Yellow        Blue

IF THE SERIAL NUMBER DOES NOT CONTAIN A VOWEL:

              Red Flash   Blue Flash   Green Flash   Yellow Flash
No Strikes:   Blue        Yellow       Green         Red
1 Strike:     Red         Blue         Yellow        Green
2 Strikes:    Yellow      Green        Blue          Red`,
  },
  {
    slug: "whos-on-first",
    title: "Who's on First",
    content: `On the Subject of Who's on First

This contraption is like something out of a sketch comedy routine, which might be funny if it wasn't connected to a bomb. I'll keep this brief, as words only complicate matters.

1. Read the display and use step 1 to determine which button label to read.
2. Using this button label, use step 2 to determine which button to push.
3. Repeat until the module has been disarmed.

STEP 1 — Based on the display, read the label of a particular button:

YES → top-left button
FIRST → top-right button
DISPLAY → bottom-left button
OKAY → top-right button
SAYS → bottom-right button
NOTHING → bottom-left button
(blank) → bottom-left button
NO → bottom-right button
LED → top-left button
LEAD → bottom-right button
READ → top-right button
RED → middle-right button
REED → bottom-left button
LEED → bottom-left button
HOLD ON → bottom-right button
YOU → middle-right button
YOU ARE → bottom-right button
YOUR → middle-right button
YOU'RE → middle-right button
UR → top-left button
THERE → bottom-right button
THEY'RE → bottom-left button
THEIR → bottom-right button
THEY ARE → bottom-left button
SEE → bottom-right button
C → top-right button
CEE → bottom-right button

STEP 2 — Using the label, push the first button in its list that is present on the module:

"READY": YES, OKAY, WHAT, MIDDLE, LEFT, PRESS, RIGHT, BLANK, READY, NO, FIRST, UHHH, NOTHING, WAIT
"FIRST": LEFT, OKAY, YES, MIDDLE, NO, RIGHT, NOTHING, UHHH, WAIT, READY, BLANK, WHAT, PRESS, FIRST
"NO": BLANK, UHHH, WAIT, FIRST, WHAT, READY, RIGHT, YES, NOTHING, LEFT, PRESS, OKAY, NO, MIDDLE
"BLANK": WAIT, RIGHT, OKAY, MIDDLE, BLANK, PRESS, READY, NOTHING, NO, WHAT, LEFT, UHHH, YES, FIRST
"NOTHING": UHHH, RIGHT, OKAY, MIDDLE, YES, BLANK, NO, PRESS, LEFT, WHAT, WAIT, FIRST, NOTHING, READY
"YES": OKAY, RIGHT, UHHH, MIDDLE, FIRST, WHAT, PRESS, READY, NOTHING, YES, LEFT, BLANK, NO, WAIT
"WHAT": UHHH, WHAT, LEFT, NOTHING, READY, BLANK, MIDDLE, NO, OKAY, FIRST, WAIT, YES, PRESS, RIGHT
"UHHH": READY, NOTHING, LEFT, WHAT, OKAY, YES, RIGHT, NO, PRESS, BLANK, UHHH, MIDDLE, WAIT, FIRST
"LEFT": RIGHT, LEFT, FIRST, NO, MIDDLE, YES, BLANK, WHAT, UHHH, WAIT, PRESS, READY, OKAY, NOTHING
"RIGHT": YES, NOTHING, READY, PRESS, NO, WAIT, WHAT, RIGHT, MIDDLE, LEFT, UHHH, BLANK, OKAY, FIRST
"MIDDLE": BLANK, READY, OKAY, WHAT, NOTHING, PRESS, NO, WAIT, LEFT, MIDDLE, RIGHT, FIRST, UHHH, YES
"OKAY": MIDDLE, NO, FIRST, YES, UHHH, NOTHING, WAIT, OKAY, LEFT, READY, BLANK, PRESS, WHAT, RIGHT
"WAIT": UHHH, NO, BLANK, OKAY, YES, LEFT, FIRST, PRESS, WHAT, WAIT, NOTHING, READY, RIGHT, MIDDLE
"PRESS": RIGHT, MIDDLE, YES, READY, PRESS, OKAY, NOTHING, UHHH, BLANK, LEFT, FIRST, WHAT, NO, WAIT
"YOU": SURE, YOU ARE, YOUR, YOU'RE, NEXT, UH HUH, UR, HOLD, WHAT?, YOU, UH UH, LIKE, DONE, U
"YOU ARE": YOUR, NEXT, LIKE, UH HUH, WHAT?, DONE, UH UH, HOLD, YOU, U, YOU'RE, SURE, UR, YOU ARE
"YOUR": UH UH, YOU ARE, UH HUH, YOUR, NEXT, UR, SURE, U, YOU'RE, YOU, WHAT?, HOLD, LIKE, DONE
"YOU'RE": YOU, YOU'RE, UR, NEXT, UH UH, YOU ARE, U, YOUR, WHAT?, UH HUH, SURE, DONE, LIKE, HOLD
"UR": DONE, U, UR, UH HUH, WHAT?, SURE, YOUR, HOLD, YOU'RE, LIKE, NEXT, UH UH, YOU ARE, YOU
"U": UH HUH, SURE, NEXT, WHAT?, YOU'RE, UR, UH UH, DONE, U, YOU, LIKE, HOLD, YOU ARE, YOUR
"UH HUH": UH HUH, YOUR, YOU ARE, YOU, DONE, HOLD, UH UH, NEXT, SURE, LIKE, YOU'RE, UR, U, WHAT?
"UH UH": UR, U, YOU ARE, YOU'RE, NEXT, UH UH, DONE, YOU, UH HUH, LIKE, YOUR, SURE, HOLD, WHAT?
"WHAT?": YOU, HOLD, YOU'RE, YOUR, U, DONE, UH UH, LIKE, YOU ARE, UH HUH, UR, NEXT, WHAT?, SURE
"DONE": SURE, UH HUH, NEXT, WHAT?, YOUR, UR, YOU'RE, HOLD, LIKE, YOU, U, YOU ARE, UH UH, DONE
"NEXT": WHAT?, UH HUH, UH UH, YOUR, HOLD, SURE, NEXT, LIKE, DONE, YOU ARE, UR, YOU'RE, U, YOU
"HOLD": YOU ARE, U, DONE, UH UH, YOU, UR, SURE, WHAT?, YOU'RE, NEXT, HOLD, UH HUH, YOUR, LIKE
"SURE": YOU ARE, DONE, LIKE, YOU'RE, YOU, HOLD, UH HUH, UR, SURE, U, WHAT?, NEXT, YOUR, UH UH
"LIKE": YOU'RE, NEXT, U, UR, HOLD, DONE, UH UH, WHAT?, UH HUH, YOU, LIKE, SURE, YOU ARE, YOUR`,
  },
  {
    slug: "memory",
    title: "Memory",
    content: `On the Subject of Memory

Memory is a fragile thing but so is everything else when a bomb goes off, so pay attention!

• Press the correct button to progress the module to the next stage. Complete all stages to disarm the module.
• Pressing an incorrect button will reset the module back to stage 1.
• Button positions are ordered from left to right.

STAGE 1:
If the display is 1, press the button in the second position.
If the display is 2, press the button in the second position.
If the display is 3, press the button in the third position.
If the display is 4, press the button in the fourth position.

STAGE 2:
If the display is 1, press the button labeled "4".
If the display is 2, press the button in the same position as you pressed in stage 1.
If the display is 3, press the button in the first position.
If the display is 4, press the button in the same position as you pressed in stage 1.

STAGE 3:
If the display is 1, press the button with the same label you pressed in stage 2.
If the display is 2, press the button with the same label you pressed in stage 1.
If the display is 3, press the button in the third position.
If the display is 4, press the button labeled "4".

STAGE 4:
If the display is 1, press the button in the same position as you pressed in stage 1.
If the display is 2, press the button in the first position.
If the display is 3, press the button in the same position as you pressed in stage 2.
If the display is 4, press the button in the same position as you pressed in stage 2.

STAGE 5:
If the display is 1, press the button with the same label you pressed in stage 1.
If the display is 2, press the button with the same label you pressed in stage 2.
If the display is 3, press the button with the same label you pressed in stage 4.
If the display is 4, press the button with the same label you pressed in stage 3.`,
  },
  {
    slug: "morse-code",
    title: "Morse Code",
    content: `On the Subject of Morse Code

An antiquated form of naval communication? What next? At least it's genuine Morse Code, so pay attention and you might just learn something.

• Interpret the signal from the flashing light using the Morse Code chart to spell one of the words in the table.
• The signal will loop, with a long gap between repetitions.
• Once the word is identified, set the corresponding frequency and press the transmit (TX) button.

HOW TO INTERPRET:
1. A short flash represents a dot.
2. A long flash represents a dash.
3. There is a long gap between letters.
4. There is a very long gap before the word repeats.

MORSE CODE CHART:
A ·—    B —···  C —·—·  D —··   E ·
F ··—·  G ——·   H ····  I ··    J ·———
K —·—   L ·—··  M ——    N —·    O ———
P ·——·  Q ——·—  R ·—·   S ···   T —
U ··—   V ···—  W ·——   X —··—  Y —·——
Z ——··
0 —————  1 ·————  2 ··———  3 ···——  4 ····—
5 ·····  6 —····  7 ——···  8 ———··  9 ————·

WORD → FREQUENCY TABLE:
shell  → 3.505 MHz
halls  → 3.515 MHz
slick  → 3.522 MHz
trick  → 3.532 MHz
boxes  → 3.535 MHz
leaks  → 3.542 MHz
strobe → 3.545 MHz
bistro → 3.552 MHz
flick  → 3.555 MHz
bombs  → 3.565 MHz
break  → 3.572 MHz
brick  → 3.575 MHz
steak  → 3.582 MHz
sting  → 3.592 MHz
vector → 3.595 MHz
beats  → 3.600 MHz`,
  },
  {
    slug: "complicated-wires",
    title: "Complicated Wires",
    content: `On the Subject of Complicated Wires

These wires aren't like the others. Some have stripes! That makes them completely different. The good news is that we've found a concise set of instructions on what to do about it! Maybe too concise...

• Look at each wire: there is an LED above the wire and a space for a "★" symbol below the wire.
• For each wire/LED/symbol combination, use the table below to decide whether or not to cut the wire.
• Each wire may be striped with multiple colors.

LETTER INSTRUCTIONS:
C = Cut the wire
D = Do not cut the wire
S = Cut the wire if the last digit of the serial number is even
P = Cut the wire if the bomb has a parallel port
B = Cut the wire if the bomb has two or more batteries

COMBINATIONS (Red coloring / Blue coloring / Has ★ / LED on):

No red, no blue, no star, LED off  → C
No red, no blue, no star, LED on   → C
No red, no blue, star, LED off     → S
No red, no blue, star, LED on      → D
No red, blue, no star, LED off     → S
No red, blue, no star, LED on      → D
No red, blue, star, LED off        → B
No red, blue, star, LED on         → B (wait — check Venn diagram)
Red, no blue, no star, LED off     → C
Red, no blue, no star, LED on      → C (check Venn diagram)
Red, no blue, star, LED off        → P
Red, no blue, star, LED on         → P
Red, blue, no star, LED off        → S
Red, blue, no star, LED on         → D
Red, blue, star, LED off           → B
Red, blue, star, LED on            → D

Note: Refer to the Venn diagram in the printed manual for exact lookup. The four properties are: wire has red coloring (dashed line), wire has blue coloring (solid line), has ★ symbol (dotted line), LED is on (thick dotted line).

See Appendix B for battery identification reference.
See Appendix C for port identification reference.`,
  },
  {
    slug: "wire-sequences",
    title: "Wire Sequences",
    content: `On the Subject of Wire Sequences

It's hard to say how this mechanism works. The engineering is pretty impressive, but there must have been an easier way to manage nine wires.

• Within this module there are several panels with wires on them, but only one panel is visible at a time. Switch to the next panel by using the down button and the previous panel by using the up button.
• Do not switch to the next panel until you are sure that you have cut all necessary wires on the current panel.
• Cut the wires as directed by the following table. Wire occurrences are cumulative over all panels within the module.

RED WIRE OCCURRENCES:
1st → Cut if connected to C
2nd → Cut if connected to B
3rd → Cut if connected to A
4th → Cut if connected to A or C
5th → Cut if connected to B
6th → Cut if connected to A or C
7th → Cut if connected to A, B, or C
8th → Cut if connected to A or B
9th → Cut if connected to B

BLUE WIRE OCCURRENCES:
1st → Cut if connected to B
2nd → Cut if connected to A or C
3rd → Cut if connected to B
4th → Cut if connected to A
5th → Cut if connected to B
6th → Cut if connected to B or C
7th → Cut if connected to C
8th → Cut if connected to A or C
9th → Cut if connected to A

BLACK WIRE OCCURRENCES:
1st → Cut if connected to A, B, or C
2nd → Cut if connected to A or C
3rd → Cut if connected to B
4th → Cut if connected to A or C
5th → Cut if connected to B
6th → Cut if connected to B or C
7th → Cut if connected to A or B
8th → Cut if connected to C
9th → Cut if connected to C`,
  },
  {
    slug: "mazes",
    title: "Mazes",
    content: `On the Subject of Mazes

This seems to be some kind of maze, probably stolen off of a restaurant placemat.

• Find the maze with matching circular markings.
• The defuser must navigate the white light to the red triangle using the arrow buttons.
• WARNING: Do not cross the lines shown in the maze. These lines are invisible on the bomb.

HOW TO USE:
1. The module shows a 6×6 grid. There are two circular markers (○) on the grid that identify which maze you are in.
2. Find the maze in the printed manual whose circular markings match the positions of the two circles on the bomb.
3. Use that maze's walls (invisible on the bomb) to guide the white light (your position) to the red triangle (the goal) using the four directional arrow buttons.

There are 9 possible mazes in the manual (3×3 grid of mazes on page 15). Each maze has two unique circular marker positions. Match those positions to identify which maze applies, then navigate accordingly.

Refer to the printed manual (page 15) to see all 9 maze diagrams, as the wall layouts cannot be reproduced in plain text.`,
  },
  {
    slug: "passwords",
    title: "Passwords",
    content: `On the Subject of Passwords

Fortunately this password doesn't seem to meet standard government security requirements: 22 characters, mixed case, numbers in random order without any palindromes above length 3.

• The buttons above and below each letter will cycle through the possibilities for that position.
• Only one combination of the available letters will match a password below.
• Press the submit button once the correct word has been set.

VALID PASSWORDS (5-letter words):
about   after   again   below   could
every   first   found   great   house
large   learn   never   other   place
plant   point   right   small   sound
spell   still   study   their   there
these   thing   think   three   water
where   which   world   would   write

STRATEGY:
1. For each of the 5 positions, note which letters are available by cycling through them.
2. Cross-reference with the word list above to find the only word that can be formed using one letter from each position's available set.
3. Set the letters to spell that word and press submit.`,
  },
];

export function getModule(slug: string): Module | undefined {
  return modules.find((m) => m.slug === slug);
}
