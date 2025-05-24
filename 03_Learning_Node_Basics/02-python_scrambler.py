#!/usr/bin/env python3
# word_scrambler.py

import argparse
import sys # For sys.exit

# Configuration: Name of the dictionary file.
# This file is expected to be in the same directory as the script
# and contain one word per line.
DICTIONARY_FILE = "words_alpha.txt"

def load_dictionary(filepath=DICTIONARY_FILE):
    """
    Loads words from the specified dictionary file.

    Args:
        filepath (str): The path to the dictionary file.

    Returns:
        set: A set of words (all lowercase, stripped of whitespace).
             Only words consisting purely of alphabetic characters are included.
             Returns an empty set if the file is empty or contains no valid words.

    Raises:
        FileNotFoundError: If the dictionary file cannot be found.
        IOError: For other file reading issues.
    """
    words = set()
    # Open the dictionary file with UTF-8 encoding for broad compatibility.
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            # Process each word: convert to lowercase and remove leading/trailing whitespace.
            word = line.strip().lower()
            # Add the word to our set only if it's not empty and consists solely of letters.
            # This filters out hyphenated words, words with apostrophes, or other non-alphabetic entries.
            if word and word.isalpha():
                words.add(word)
    return words

def can_form_word(word, allowed_letters_set):
    """
    Checks if a given word can be formed exclusively using letters
    from the allowed_letters_set.

    The problem states "The same letter can be used multiple times",
    meaning if a letter is in allowed_letters_set, it can appear
    any number of times in the 'word'.

    Args:
        word (str): The word to check (assumed to be lowercase and alphabetic).
        allowed_letters_set (set): A set of unique lowercase letters that are
                                   permitted for forming words.

    Returns:
        bool: True if all characters in 'word' are present in 'allowed_letters_set',
              False otherwise.
    """
    # Iterate through each character of the candidate word.
    for char_in_word in word:
        # If any character in the word is not found in our set of allowed letters,
        # then this word cannot be formed.
        if char_in_word not in allowed_letters_set:
            return False
    # If the loop completes, it means all characters in the word are allowed.
    return True

def main():
    """
    Main function to orchestrate the word finding process:
    1. Parses command-line arguments for the 6 input letters.
    2. Validates the input.
    3. Loads the dictionary.
    4. Iterates through dictionary words to find matches.
    5. Prints the results.
    """
    # --- Argument Parsing ---
    # Set up the command-line argument parser.
    # The script expects one positional argument: a string of 6 letters.
    parser = argparse.ArgumentParser(
        description="Finds all possible English words that can be created from a given string of 6 letters. "
                    "Letters from the input string can be used multiple times in the found words."
    )
    parser.add_argument(
        "letters_input",
        type=str,
        help="A string of exactly 6 alphabetic characters (e.g., 'banana', 'python'). Case-insensitive."
    )
    args = parser.parse_args()

    # Convert the input string to lowercase for case-insensitive comparison.
    input_str_original_case = args.letters_input
    input_str_lower = input_str_original_case.lower()

    # --- Input Validation ---
    # 1. Check if the input string is exactly 6 characters long.
    if len(input_str_lower) != 6:
        print(f"Error: Input must be exactly 6 characters long. You provided '{input_str_original_case}' which has {len(input_str_lower)} character(s).")
        sys.exit(1) # Exit with an error code

    # 2. Check if all characters in the input string are alphabetic.
    if not input_str_lower.isalpha():
        print(f"Error: Input must contain only alphabetic characters. You provided '{input_str_original_case}'.")
        sys.exit(1)

    # --- Determine Allowed Letters ---
    # Create a set of unique letters from the input string.
    # For example, if input_str_lower is "banana", allowed_letters_set will be {'b', 'a', 'n'}.
    allowed_letters_set = set(input_str_lower)
    # For debugging or user info: print(f"DEBUG: Input string: '{input_str_lower}', Allowed unique letters: {sorted(list(allowed_letters_set))}")

    # --- Load Dictionary ---
    try:
        # This is a crucial step: loading all dictionary words into memory (a set for efficient lookup).
        print(f"Loading dictionary from '{DICTIONARY_FILE}'...")
        dictionary_words = load_dictionary()
        if not dictionary_words:
            print(f"Warning: The dictionary file '{DICTIONARY_FILE}' was loaded but found to be empty or contained no valid alphabetic words.")
            # Script can continue, will just find no matches.
        print(f"Dictionary loaded. {len(dictionary_words)} words found.")
    except FileNotFoundError:
        print(f"Critical Error: Dictionary file '{DICTIONARY_FILE}' not found.")
        print(f"Please ensure the file is in the same directory as this script ({sys.argv[0]}), or update the DICTIONARY_FILE variable in the script.")
        sys.exit(1)
    except IOError as e:
        print(f"Critical Error: Could not read dictionary file '{DICTIONARY_FILE}': {e}")
        sys.exit(1)
    except Exception as e: # Catch any other unexpected errors during dictionary loading
        print(f"An unexpected error occurred while loading the dictionary: {e}")
        sys.exit(1)

    # --- Find Valid Words ---
    # This list will store all words from the dictionary that can be formed
    # using only the letters in allowed_letters_set.
    print("Searching for matching words...")
    valid_words_found = []
    for dict_word in dictionary_words:
        # The core logic: check if the current dictionary word can be formed.
        # The dict_word is already lowercase and confirmed alphabetic by load_dictionary.
        if can_form_word(dict_word, allowed_letters_set):
            valid_words_found.append(dict_word)

    # --- Output Results ---
    if valid_words_found:
        # Sort the list of found words alphabetically for consistent and readable output.
        # Using set() then list() for sorted() is redundant if valid_words_found doesn't have duplicates,
        # but ensures uniqueness if there were any (though load_dictionary already uses a set).
        sorted_valid_words = sorted(list(set(valid_words_found)))

        print(f"\nFound {len(sorted_valid_words)} words that can be formed using only letters from '{input_str_original_case}' "
              f"(unique allowed letters: {''.join(sorted(list(allowed_letters_set)))}):")
        for word in sorted_valid_words:
            print(word)
    else:
        print(f"\nNo words could be formed using only letters from '{input_str_original_case}' "
              f"(unique allowed letters: {''.join(sorted(list(allowed_letters_set)))}).")

if __name__ == "__main__":
    # This standard Python construct ensures that main() is called only when
    # the script is executed directly (e.g., `python word_scrambler.py example`),
    # and not when it's imported as a module into another script.
    main()
