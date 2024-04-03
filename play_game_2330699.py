from noughtsandcrosses_2330699 import welcome,menu,\
    play_game,save_score,load_scores,display_leaderboard

def main():
    '''
    Main entry point of the whole game.
    '''
    board = [
                ['1','2','3'],
                ['4','5','6'],
                ['7','8','9']
            ]

    total_score = 0
    while True:
        choice = menu()
        if choice == '1':
            welcome(board)
            score = play_game(board)
            total_score += score
            print('\nYour current score is:',total_score)
        if choice == '2':
            save_score(total_score)
            total_score = 0
        if choice == '3':
            leader_board = load_scores()
            display_leaderboard(leader_board)
        if choice == 'q':
            print('Thank you for playing the "Unbeatable Noughts and Crosses" game.')
            print('Good bye')
            return

if __name__ == '__main__':
    main()
