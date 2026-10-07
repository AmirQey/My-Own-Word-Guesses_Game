# Guess the Word Game
<img width="817" height="745" alt="image" src="https://github.com/user-attachments/assets/efffdac9-5a2c-4375-8fe2-640ffbf9ac9a"/>

My first project with Javascript, I've had experienced with HTML and CSS but I rarely include Javascript.

## How to play
click link https://amirqey.github.io/My-Own-Word-Guesses_Game/
1. Type a word and submit it
2. If error popup is shown, it's probably of this 3 cases
    - The word length of your guess doesn't fit with the box length.
    - The word includes non alphabet.
    - The word is not in the names.txt
        - for this case, kindly use another word.
3. If the submiited guess is valid guess that passes all the 3 cases,   the box will change colors.
    - Teal: right letter, right place.
    - Orange: right letter, wrong place.
    - Grey: wrong letter.


# Architecture

I prepare the code in python first to get all the logics in a system where the game run as expectedly, its much easier and I am more comfortable using python.

Later I create a html file containing the css and js and build all the code in one file until I finished it. I get some help from Claude to help me convert the python code into js by explaining the concepts with analogies and reviewed my code, I wrote and debugged the code myself. The async function was adapted from an example version it gave me. Then I build my code and separate them in 3 different files.

# Constraint

In python code, all the words are randomly selected by the wonderwords library while being validated with enchant library so only real English words were used.

But in js, I only use the a text file containing 200+ 5-lengths of words and randomly pick 1 using the math random function. Therefore, it is not random as it is in python version but 200+ words is enough for random word.

In the game, I style a text field for user to write their guess, but in the real game...the letter is automatically written or deleted in the boxes. Supposedly the user can't even enter their guess if their guess has errors, but in my version the word takes the raw guess and validated after the player submits it.

I also don't put the on screen keyboard display that shows if a letter is in the word or not.


# Improvement Suggestion

1. Remove the constraint.
2. Put more CSS animation.
3. Improve the randomness of the word.
