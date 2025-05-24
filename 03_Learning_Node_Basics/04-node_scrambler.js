#!/usr/bin/env node
// 04-node_scrambler.js

// --- How to Run This Script ---
// 1. Save this file as '04-node_scrambler.js'.
// 2. Make sure you have Node.js installed on your system.
// 3. Ensure the 'words_alpha.txt' dictionary file is in the same directory as this script.
// 4. Open your terminal or command prompt.
// 5. Navigate to the directory where you saved this file.
// 6. Run the script using Node.js, followed by a 6-letter string:
//    node 04-node_scrambler.js banana
//    node 04-node_scrambler.js python
//
//    If you make the script executable (e.g., on Linux/macOS: chmod +x 04-node_scrambler.js),
//    you might be able to run it directly:
//    ./04-node_scrambler.js banana

// --- Module Imports ---
// In Python, you import modules like this:
// import argparse
// import sys
//
// In Node.js, you 'require' built-in modules or installed packages.
const fs = require('fs'); // 'fs' (File System) module is for file operations, similar to Python's built-in open() and os module.
const path = require('path'); // 'path' module provides utilities for working with file and directory paths.

// --- Configuration ---
// Python: DICTIONARY_FILE = "words_alpha.txt"
// Node.js: We use 'const' for variables that won't be reassigned.
const DICTIONARY_FILE = "words_alpha.txt";

/**
 * Loads words from the specified dictionary file.
 *
 * Python equivalent: def load_dictionary(filepath=DICTIONARY_FILE):
 *
 * @param {string} filepath - The path to the dictionary file. Defaults to DICTIONARY_FILE.
 * @returns {Set<string>} A Set of words (all lowercase, stripped of whitespace).
 * Only words consisting purely of alphabetic characters are included.
 * Returns an empty Set if the file is empty or contains no valid words.
 * @throws {Error} If the dictionary file cannot be found or read.
 */
function loadDictionary(filepath = DICTIONARY_FILE) {
    // Python: words = set()
    // Node.js: 'Set' is a built-in object that lets you store unique values of any type.
    const words = new Set();

    // In Python, you'd use a try-except block for FileNotFoundError or IOError.
    // In Node.js, fs.readFileSync will throw an error if the file doesn't exist or can't be read.
    // We'll handle this in the main function where loadDictionary is called.

    // Python: with open(filepath, 'r', encoding='utf-8') as f:
    // Node.js: fs.readFileSync reads the entire file content synchronously.
    // 'utf-8' is a common encoding.
    const fileContent = fs.readFileSync(filepath, 'utf-8');

    // Python: for line in f:
    // Node.js: We split the file content by newline characters to get an array of lines.
    const lines = fileContent.split(/\r?\n/); // Handles both Windows (\r\n) and Unix (\n) line endings.

    for (const line of lines) {
        // Python: word = line.strip().lower()
        // Node.js: .trim() removes whitespace from both ends. .toLowerCase() converts to lowercase.
        const word = line.trim().toLowerCase();

        // Python: if word and word.isalpha():
        // Node.js:
        //   - 'word' (checking if it's not an empty string after trimming)
        //   - For 'isalpha()', JavaScript doesn't have a direct equivalent. We use a regular expression.
        //     /^[a-z]+$/i : ^ asserts position at start of the string
        //                    [a-z]+ matches one or more lowercase letters
        //                    $ asserts position at the end of the string
        //                    i flag makes it case-insensitive (though we've already lowercased)
        //     We use /^[a-z]+$/ because word is already lowercased.
        if (word && /^[a-z]+$/.test(word)) {
            // Python: words.add(word)
            // Node.js: Set.add() method
            words.add(word);
        }
    }
    return words;
}

/**
 * Checks if a given word can be formed exclusively using letters
 * from the allowedLettersSet.
 *
 * Python equivalent: def can_form_word(word, allowed_letters_set):
 *
 * @param {string} word - The word to check (assumed to be lowercase and alphabetic).
 * @param {Set<string>} allowedLettersSet - A Set of unique lowercase letters permitted.
 * @returns {boolean} True if all characters in 'word' are in 'allowedLettersSet', False otherwise.
 */
function canFormWord(word, allowedLettersSet) {
    // Python: for char_in_word in word:
    // Node.js: A 'for...of' loop can iterate over iterable objects like strings.
    for (const charInWord of word) {
        // Python: if char_in_word not in allowed_letters_set:
        // Node.js: Set.has() method checks for the presence of an element.
        if (!allowedLettersSet.has(charInWord)) {
            return false;
        }
    }
    // Python: return True (if loop completes)
    // Node.js:
    return true;
}

/**
 * Main function to orchestrate the word finding process.
 *
 * Python equivalent: def main():
 */
function main() {
    // --- Argument Parsing ---
    // Python: parser = argparse.ArgumentParser(...)
    //         parser.add_argument("letters_input", ...)
    //         args = parser.parse_args()
    //         input_str_original_case = args.letters_input
    // Node.js: 'process.argv' is an array containing command line arguments.
    //   process.argv[0] is the path to Node.js executable.
    //   process.argv[1] is the path to the script being run.
    //   process.argv[2] onwards are the actual arguments passed.
    // This is simpler than Python's argparse for basic cases but less flexible.
    // For more complex CLI apps, libraries like 'yargs' or 'commander' are used in Node.js.

    if (process.argv.length < 3) {
        // Similar to argparse showing help if arguments are missing.
        console.error("Error: Please provide a 6-letter string as an argument.");
        console.error("Usage: node 04-node_scrambler.js <letters>");
        // Python: sys.exit(1)
        // Node.js: process.exit(exitCode)
        process.exit(1);
    }
    const inputStrOriginalCase = process.argv[2];

    // Python: input_str_lower = input_str_original_case.lower()
    // Node.js:
    const inputStrLower = inputStrOriginalCase.toLowerCase();

    // --- Input Validation ---
    // Python: if len(input_str_lower) != 6:
    // Node.js: String.length property
    if (inputStrLower.length !== 6) {
        // Python: print(f"Error: ...")
        // Node.js: console.error() for error messages (goes to stderr).
        //          Template literals (backticks ``) for string formatting, similar to Python's f-strings.
        console.error(`Error: Input must be exactly 6 characters long. You provided '${inputStrOriginalCase}' which has ${inputStrLower.length} character(s).`);
        process.exit(1);
    }

    // Python: if not input_str_lower.isalpha():
    // Node.js: Using a regular expression again. /^[a-z]+$/ checks if the entire string is only letters.
    if (!/^[a-z]+$/.test(inputStrLower)) {
        console.error(`Error: Input must contain only alphabetic characters. You provided '${inputStrOriginalCase}'.`);
        process.exit(1);
    }

    // --- Determine Allowed Letters ---
    // Python: allowed_letters_set = set(input_str_lower)
    // Node.js: Create a Set from the characters of the string.
    //          '...' is the spread syntax, it expands an iterable (like a string) into individual elements.
    const allowedLettersSet = new Set([...inputStrLower]);
    // For debugging, similar to Python's print for debug:
    // console.log(`DEBUG: Input string: '${inputStrLower}', Allowed unique letters: ${[...allowedLettersSet].sort().join('')}`);


    // --- Load Dictionary ---
    // Python: try...except FileNotFoundError...
    // Node.js: try...catch block for error handling.
    let dictionaryWords;
    try {
        // Python: print(f"Loading dictionary from '{DICTIONARY_FILE}'...")
        // Node.js: console.log() for standard output.
        console.log(`Loading dictionary from '${DICTIONARY_FILE}'...`);
        dictionaryWords = loadDictionary(); // DICTIONARY_FILE is used by default
        if (dictionaryWords.size === 0) {
            // Python: print(f"Warning: ...")
            // Node.js: console.warn() for warnings.
            console.warn(`Warning: The dictionary file '${DICTIONARY_FILE}' was loaded but found to be empty or contained no valid alphabetic words.`);
        }
        // Python: print(f"Dictionary loaded. {len(dictionary_words)} words found.")
        // Node.js: Set.size property (equivalent to Python's len() for sets/lists).
        console.log(`Dictionary loaded. ${dictionaryWords.size} words found.`);
    } catch (error) {
        // Python: except FileNotFoundError: print(...)
        //         except IOError as e: print(...)
        // Node.js: 'error' object often has a 'code' property for specific errors (e.g., 'ENOENT' for file not found).
        if (error.code === 'ENOENT') { // ENOENT: Error NO ENTry (file not found)
            console.error(`Critical Error: Dictionary file '${DICTIONARY_FILE}' not found.`);
            // Python: print(f"... {sys.argv[0]} ...")
            // Node.js: path.basename(process.argv[1]) gets the script name.
            console.error(`Please ensure the file is in the same directory as this script (${path.basename(process.argv[1])}), or update the DICTIONARY_FILE variable in the script.`);
        } else {
            console.error(`Critical Error: Could not read dictionary file '${DICTIONARY_FILE}': ${error.message}`);
        }
        process.exit(1);
    }

    // --- Find Valid Words ---
    // Python: valid_words_found = []
    // Node.js: Use an array.
    console.log("Searching for matching words...");
    const validWordsFound = [];
    // Python: for dict_word in dictionary_words:
    // Node.js: Iterating over a Set.
    for (const dictWord of dictionaryWords) {
        // Python: if can_form_word(dict_word, allowed_letters_set):
        // Node.js:
        if (canFormWord(dictWord, allowedLettersSet)) {
            // Python: valid_words_found.append(dict_word)
            // Node.js: Array.push() method.
            validWordsFound.push(dictWord);
        }
    }

    // --- Output Results ---
    // Python: if valid_words_found:
    // Node.js: Check array length.
    if (validWordsFound.length > 0) {
        // Python: sorted_valid_words = sorted(list(set(valid_words_found)))
        // Node.js:
        //   1. validWordsFound is already an array of unique words because dictionaryWords was a Set
        //      and canFormWord doesn't duplicate. If it could, new Set(validWordsFound) would ensure uniqueness.
        //   2. .sort() sorts an array in place (alphabetically for strings by default).
        const sortedValidWords = [...validWordsFound].sort(); // Create a copy before sorting if original order matters elsewhere

        // Python: print(f"\nFound {len(sorted_valid_words)} words ...")
        // Node.js:
        console.log(`\nFound ${sortedValidWords.length} words that can be formed using only letters from '${inputStrOriginalCase}' ` +
                    `(unique allowed letters: ${[...allowedLettersSet].sort().join('')}):`);
        // Python: for word in sorted_valid_words: print(word)
        // Node.js:
        for (const word of sortedValidWords) {
            console.log(word);
        }
    } else {
        // Python: print(f"\nNo words could be formed ...")
        // Node.js:
        console.log(`\nNo words could be formed using only letters from '${inputStrOriginalCase}' ` +
                    `(unique allowed letters: ${[...allowedLettersSet].sort().join('')}).`);
    }
}

// --- Script Execution ---
// Python: if __name__ == "__main__": main()
// Node.js: In Node.js, a script is executed from top to bottom.
//          To make it behave like Python's __main__ check (e.g., if you wanted to import functions
//          from this file into another without running main()), you could do:
//          if (require.main === module) { main(); }
//          For a simple script like this, just calling main() is common.
main();
