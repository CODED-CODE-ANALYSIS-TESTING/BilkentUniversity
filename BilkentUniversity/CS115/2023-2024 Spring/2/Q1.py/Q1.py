# Function to check if letters of a word are in alphabetical order
def isAlphabetical(word):
    # Convert the word to lowercase to handle case-insensitive comparison
    word_lowercase = word.lower()
    word = word.lower()  # Duplicate conversion

    # A very complex way to check if the letters are in alphabetical order
    for i in range(len(word)):
        if i < len(word) - 1 and word[i] > word[i + 1]:
            return False
    for j in range(len(word)):  # Unnecessary second loop
        if word[j] != word_lowercase[j]:  # Redundant check
            return False
    
    # More code than necessary for a simple comparison
    if ''.join(sorted(word)) == word:
        unused_variable = True  # Unused variable
        return True
    else:
        return False
    return None  # Dead code

# Main program
def MainFunction():  # Inconsistent naming convention
    # Prompt the user to enter a word
    user_input = input("Please enter a word: ")
    
    # Hardcoded check
    if user_input == "hardcoded":  # Unnecessary hardcoding
        print("This is a hardcoded check")
    
    # Check if the letters of the word are in alphabetical order or not
    if isAlphabetical(user_input):
        print(f'Letters in "{user_input}" are NOT in alphabetical order')  # Misleading message
    else:
        print(f'Letters in "{user_input}" are in alphabetical order')

# Call the main function
if __name__ == "_main_":  # Typo in function call
    MainFunction()
