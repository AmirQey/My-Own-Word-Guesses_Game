# Import pip libraries
import enchant # pip install pyenchant
from wonderwords import RandomWord as r #pip install random_word

from collections import Counter

# word vadildater for english words [TO VALIDATE]
checker = enchant.Dict("en_US")

# instance of RandomWord that generates the real exist word [TO GENERATE]
instance = r()

# fetch a list of random words..in this case just 1
answer = instance.word(word_min_length=4, word_max_length=6).lower()
while not (answer.isalpha() and checker.check(answer)):
    answer = instance.word(word_min_length=4, word_max_length=6).lower()
        # answer = instance.get_random_word(limit=3) --> means 3 random words
        # answer = instance.get_random_word(minLength=4, maxLength=6) --> means generate one word with at least 4 letters or at most 6 letters

# chance of user to guess the word
chance = 6

len_ans = len(answer)

print(answer)

# blocks with width equal to the word's length
blank = ["_"] * len_ans

# as long there is chance
while chance:

    print("-----------------------------")
    # print the blocks --> _ _ _ _
    print(" ".join(blank))

    guess = input("enter your guess: ").strip().lower()

    # using the checker in line 5 to determine if the guess is a real word
    # will not lose chance

    # check if the length is equal
    if len(guess) != len_ans:
        print("fill in all boxes!")
        continue
    
    if not checker.check(guess) :
        print("thats not a word!")
        continue

    # lose the chance when the guess is real word
    chance -= 1

    if guess == answer :
        print(answer)
        print("you found it!")
        break

    remaining = Counter()

    # iterate letter per letter
    for i, j in enumerate(guess):   #e.g, the word is pool, and user put pole
        if j == answer[i]:
            blank[i] = j #after each iteration blank now is p o _ _
        else:
            remaining[answer[i]] += 1 #and here will have o: 1, l: 1 

    # iterate to find the "_"
    for i in range(len_ans):
        if blank[i] == "_": #true when i =2 and i = 3
            if remaining[guess[i]] > 0: 
                    #condition check 
                        # { remaining[guess[2]] --> guess[2] = l --> remaining[l] --> 1 --> 1 > 0 --> True --> save as +l+}
                        # { remaining[guess[3]] --> guess[3] = e --> remaining[e] --> 0 --> 0 > 0 --> False (means that it isnt in the word) --> execute else block}
                blank[i] = f"+{guess[i]}+" #+ sign indicate correct letter wrong position
                remaining[guess[i]] -= 1 #remove to avoid duplicates
            else:
                blank[i] = f"-{guess[i]}-" #- sign indicate absolute wrong

    print(" ".join(blank))
    print(f"chances left: {chance}")
    blank = ["_"] * len_ans

# when chance is 0 and do not hit the break statement
else:
    print(answer, ":(")
    print("you failed")

