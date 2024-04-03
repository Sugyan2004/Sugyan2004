
import random
import json
import copy # to clone board in the bot's algorithm.
import time
random.seed()

def draw_board(board):
    """
    This is draw method which prints the game board.
    """
    print("\n")
    for row in board:
        current_row_line = "  "
        for cell in row:
            if len(cell.strip())==0:
                current_row_line+=" - "
            else:
                current_row_line+=f" {cell} "
        current_row_line+="  "
        print(current_row_line)
    print("\n")

def welcome(board):
    '''
    This is a welcome method which prints the welcome
    message for the user. It also instructs the user about the
    game board.
    '''
    print("\nWelcome to the unbeatable noughts and crosses game!!!")
    print("Your game board will look like this")
    draw_board(board)
    print("Give the cell values as in the above cells.")

def initialise_board(board):
    '''
     it server the purpose of reset the board by setting all it's cells to empty spaces - " "
    '''
    for i in range(3):
        for j in range(3):
            board[i][j] = " "

    return board

def get_player_move(board):
    '''
    Returns the player move as row and column
    '''
    while True:
        try:
            user_move = int(input("Your move:"))
            if user_move in range(1,10):
                user_move = user_move - 1
                row = int(user_move / 3)
                column = user_move % 3
                if len(board[row][column].strip())==0:
                    return row,column
                print("The cell is occupied.")
            else:
                print("Cell Invalid. enter between 1 and 9.")
        except ValueError:
            print("Sorry, I don't understand.")

def available_moves(board):
    '''
    This method returns the indexes which are empty.
    '''
    moves = []
    i = 0
    for row in board:
        for cell in row:
            if len(cell.strip())==0:#if empty
                moves.append(i)
            i+=1
    return moves

def choose_computer_move(board):
    '''
    This method contains a simple algorithm which
    tries to defend the player move. It selects the cells
    randomly if not required to defend.
    Just defending makes the user move engaged as
    user will be able to win.
    '''
    current_moves = available_moves(board)

    for move in current_moves:
        copy_of_original_board = copy.deepcopy(board)
        row = move // 3
        col = move % 3

        copy_of_original_board[row][col] = "O"
        if check_for_win(copy_of_original_board,"O"):
            return (row,col)

    for move in current_moves:
        copy_of_original_board = copy.deepcopy(board)
        row = move // 3
        col = move % 3

        copy_of_original_board[row][col] = "X"
        if check_for_win(copy_of_original_board,"X"):
            return (row,col)

    choosen_index = random.choice(current_moves)
    choosen_move = (choosen_index//3, choosen_index%3)
    return choosen_move

def check_for_win(board, mark):
    '''
    Returns if the player or computer is the winner.
    It works according to the mark parameter.
    '''
    is_winner = False
    if board[0][0]==board[1][0]==board[2][0]==mark or\
            board[0][2]==board[1][2]==board[2][2]==mark or\
            board[0][1]==board[1][1]==board[2][1]==mark:
        is_winner = True

    elif board[0][0]==board[0][1]==board[0][2]==mark or\
            board[2][0]==board[2][1]==board[2][2]==mark or\
            board[1][0]==board[1][1]==board[1][2]==mark:
        is_winner = True

    elif (board[0][2]==board[1][1]==board[2][0]==mark) or\
            (board[0][0]==board[1][1]==board[2][2]==mark):
        is_winner = True

    #If no winning case is true, the is_winner is False.
    return is_winner

def check_for_draw(board):
    '''
    Checks if all the cells in the board are already filled.
    If any of the cell is not filled, returns False.
    At last, if all are filled, True is returned.
    '''
    draw = True
    for row in board:
        for cell in row:
            if len(cell.strip())==0:
                draw = False
                break
    #If atleast one cell is left to fill, not draw.
    #If all the cells are filled, the draw is never changed to False
    return draw

def play_game(board):
    '''
    Handles one game.
    Returns 1 if the user is the winner
    Returns 0 if draw
    Returns -1 if user loses
    '''
    board = initialise_board(board)
    player_1_mark = "X" #user
    player_2_mark = "O" #bot
    current_player_mark = "X"
    tie = False
    is_player_winner = False
    score = 0
    draw_board(board) #Drawing the empty board.
    while True:
        print("\n\n\n")
        if current_player_mark==player_1_mark:
            row,column = get_player_move(board)
        else:
            time.sleep(0.5)
            row,column = choose_computer_move(board)

        board[row][column] = current_player_mark
        if current_player_mark==player_2_mark:
            draw_board(board) #After each player's move, drawing the board.
        if check_for_win(board,current_player_mark):
            score = -1
            if current_player_mark==player_1_mark:
                is_player_winner = True
                score = 1
            break

        if check_for_draw(board):
            tie = True
            break

        current_player_mark = player_2_mark if current_player_mark==player_1_mark else player_1_mark

    if not tie:
        if is_player_winner:
            print("You won !")
        else:
            print("You lose !")
    else:
        print("Game Tie !")
    return score

def menu():
    '''
    Returns the user's choice from keyboard input.
    '''
    print("Game Controls:")
    print("1 ====> Play.")
    print("2 ====> Save the score")
    print("3 ====> Show leaderboard")
    print("q ====> Exit")
    choices = ['1','2','3','4','q']
    while True:
        user_choice = input("\nEnter your choice :").lower()
        if user_choice in choices:
            return user_choice
        print(f"Invalid Choice '{user_choice}'\nValid Chices: {choices}")

def load_scores(filename = "leaderboard.txt"):
    '''
    Returns the leaderboard dictionary from the file.
    '''
    filedata = ""
    try:
        with open(filename,mode='r',encoding='UTF-8') as file:
            filedata = file.read()
    except FileNotFoundError:
        print("Leaderboard file not found.")
        return {}
    try:
        return json.loads(filedata)
    except json.decoder.JSONDecodeError:
        print("Couldn't read data from the leaderboard file")
        print("Please fix the leaderboard file.")
        return {}

def save_score(score):
    '''
    Updates the leaderboard file with the new score.
    '''
    leader_board = load_scores()
    username = input("\n\nYour name:")
    if username in leader_board:
        leader_board[username]+=score
    else:
        leader_board[username] = score

    try:
        with open("leaderboard.txt","w",encoding="UTF-8") as file:
            json.dump(leader_board,file)
    except IOError:
        print("Some error while saving the leader_board")

def display_leaderboard(leaders):
    '''
    Just prints the data in the leaderboard given.
    '''
    print("\n\nLeaderboard\n"+"-"*10)
    for user_name in leaders:
        print(f"{user_name}  ===> {leaders[user_name]}")
    print("\n"+"-"*10+"\n")
