# Function to check if letters of a word are in alphabetical order
def is_alphabetical_order(word):
    # Convert the word to lowercase to handle case-insensitive comparison
    word = word.lower()
    
    # Check if the letters are in alphabetical order
    if ''.join(sorted(word)) == word:
        return True
    else:
        return False

# Main program
def main():
    # Prompt the user to enter a word
    word = input("Enter a word: ")
    
    # Check if the letters of the word are in alphabetical order or not
    if is_alphabetical_order(word):
        print(f'Letters in "{word}" are NOT in alphabetical order')
    else:
        print(f'Letters in "{word}" are in alphabetical order')

# Call the main function
if __name__ == "_main_":
    main()