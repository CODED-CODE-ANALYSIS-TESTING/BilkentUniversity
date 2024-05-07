# Lab02_Q3.py

def main():
    word = input("Enter a word: ")
    if all(word[i] <= word[i+1] for i in range(len(word)-1)):
        print(f"Letters in \"{word}\" are in alphabetical order")
    else:
        print(f"Letters in \"{word}\" are NOT in alphabetical order")

if __name__ == "__main__":
    main()

