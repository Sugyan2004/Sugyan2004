"""
    Caesar Cipher Program
    Student Name: Sugyan Singh Dangol
    Student ID: 2330699
"""

ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ"
EXIT_TEXT = "\nThankyou, goodbye!"
AGAIN_TEXT = "\nWould you like to encrypt or decrypt another message? (y/n): "
ACTION_TEXT = "\nWould you like to encrypt (e) or decrypt (d)?: "
ENCODING = "utf-8"


# ? Welcome Message
def welcome():

    print("\nWelcome to the Caesar Cipher.")
    print("This program encrypts and decrypts text with the Caesar Cipher.")


# ? Take mode input
def enter_message(action):

    if action == "e":
        message = input("\nWhat message would you like to encrypt: ")
        message = message.upper()
        shift = int(input("What is the shift number: "))

    elif action == "d":
        message = input("\nWhat message would you like to decrypt: ")
        message = message.upper()
        shift = int(input("What is the shift number: "))

    else:
        print('\nInvalid Mode!! Please select "e" or "d". ')

    return (action, message, shift)


# ? Function to encrypt the message
def encrypt(message, shift):

    encrypted = ""

    for letter in message:
        if letter in ("", " ", "\n"):
            encrypted += letter
        else:
            index = ALPHABETS.index(letter) + shift
            encrypted += ALPHABETS[index]

    return f"\n{encrypted}"


# ? Function to decrypt the message
def decrypt(message, shift):
    
    decrypted = ""

    for letter in message:
        if letter in ("", " ", "\n"):
            decrypted += letter
        else:
            index = ALPHABETS.index(letter) - shift
            decrypted += ALPHABETS[index]

    return f"\n{decrypted}"


# ? Take the file and read line by line and encrypt it and store it in a list
def process_file(filename, action):

    shift = int(input("What is the shift number: "))
    actioned_list = []

    with open(filename, encoding=ENCODING) as file:
        length = len(file.readlines())

    with open(filename, encoding=ENCODING) as file:
        for _ in range(length):
            if action == "e":
                actioned_list.append(encrypt(file.readline().upper(), shift))
            elif action == "d":
                actioned_list.append(decrypt(file.readline().upper(), shift))

    return actioned_list


# ? Checks if a file exists
def is_file(filename):

    try:
        with open(filename, encoding=ENCODING):
            return True
    except (IOError, OSError):
        return False


# ? Write encrypted message to a new file
def write_messages(message_list):

    if is_file("results.txt"):
        with open("results.txt", "w", encoding=ENCODING) as file:
            for items in message_list:
                file.write(f"{items}\n")
    else:
        with open("results.txt", "x", encoding=ENCODING) as file:
            for items in message_list:
                file.write(f"{items}\n")


# ? Console mode or File mode, do appropriate action
def message_or_file():
   
    while True:
        action = input(ACTION_TEXT).lower()

        if action in ("e", "d"):
            console = input(
                "\nDo you want to process messages using console or file? (c or f) "
            )

            if console == "f":
                filename = input("\nEnter file name with it's extension: ")
                if is_file(filename):
                    write_messages(process_file(filename, action))
                    print("\nAction completed successfully.")

                    try_again = input(AGAIN_TEXT)

                    if try_again == "n":
                        return print(EXIT_TEXT)

                    main()

                else:
                    print("\nFile not found!!\nTry Again!\n")

            elif console == "c":
                return enter_message(action)

            else:
                print('\nInvalid Choice. Please choose "f" or "c"!')

        else:
            print('Invalid Choice. Please choose "e" or "d"!')


# ? Main function to start the program and also print the output
def main():

    # ? Printing the welcome message
    welcome()

    # ? Getting action, message and shift values to use if mode is console
    values = message_or_file()

    if values is not None:
        if values[0] == "e":
            print(encrypt(values[1], values[2]))

        elif values[0] == "d":
            print(decrypt(values[1], values[2]))

        try_again = input(AGAIN_TEXT)

        if try_again == "n":
            return print(EXIT_TEXT)

        main()

    return None


# ? Start
main()
