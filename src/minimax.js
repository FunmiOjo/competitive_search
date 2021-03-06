/*
 * MINIMAX.JS
 *
 * This is the only file you need
 * to modify to pass the tests.
 *
 * Note that you should read
 * the pre-written functions.
 *
 * Contents:
 * 1. minimaxWrapper:   Pre-written
 * 2. heuristic:        Pre-written
 * 3. baseCase:         Must complete
 * 4. minimax:          Must complete
 * 5. minimaxAlphaBeta: Must complete
 */

/*
 * minimaxWrapper
 *
 * This is the only function called when
 * playing against your algorithm.
 *
 * To switch from playing against the
 * 'minimax' to 'minimaxAlphaBeta'
 * algorithm, swap the function
 * called below.
 */
const DEPTH = 3;
const minimaxWrapper = (state, maximizingPlayer) =>
    minimaxAlphaBeta(state, DEPTH, maximizingPlayer);

/*
 * heuristic
 *
 * The 'heuristic' function returns a number
 * evaluating how good a state is, from the
 * perspective of the maximizing player.
 * You will need to invoke it in minimax.
 * Spend a little time trying to understand
 * it.
 *
 * Input:
 *  state: Object representing state.
 *  maximizingPlayer: 'x' or 'o'.
 * Output:
 *  Number evaluating how good state is,
 *  from perspective of maximizing
 *  player. Positive, if to the advantage
 *  of the maximizing player; negative,
 *  if to their disadvantage.
 */
const heuristic = (state, maximizingPlayer) => {

	//This is how you can retrieve the minimizing player.
    const minimizingPlayer = (maximizingPlayer == 'x') ? 'o' : 'x';

    // state.numLines(number, player) gives you the number
    // of lines of length "number" for that player.
    //
    // So for instance, for a state like this
    // _ _ _ _ _ _ _
    // _ _ _ _ _ _ _
    // _ _ _ _ x _ o
    // _ _ _ x o _ x
    // _ _ o x o _ x
    //
    // state.numLines(2,'o') would return 1
    // state.numLines(2,'x') would return 3
    //
    // The following function, sums up the number of lines
    // of lengths 2, 3, and 4, weighted very strongly according
    // to their length.
    const advantageFunction = player => [2,3,4].reduce((total, numLines) =>
        total + state.numLines(numLines, player) * Math.pow(100, numLines), 0);

    // Then for the heuristic, we just return the advantage
    // of the maximizing player, less the advantage of the
    // minimizing player.
    return advantageFunction(maximizingPlayer) - advantageFunction(minimizingPlayer);
}

/*
 * isBaseCase
 *
 * Should return true if we should no
 * longer recurse through minimax. So
 * if you have reached a depth of zero or
 * there are no possible successor states,
 * it should return true.
 *
 * ANY INFORMATION YOU NEED from
 * the "state" object is already pulled
 * from it.
 *
 */
const isBaseCase = (state, depth) => {
    const possibleSuccessorStates = state.nextStates();
    const numberPossibleSuccessorStates = possibleSuccessorStates.length;
    return (numberPossibleSuccessorStates === 0 || depth === 0)
}

/*
 * minimax
 *
 * Input:
 *   state: Object representing state
 *   depth: How much deeper one should recurse
 *   maximizingPlayer: 'x' or 'o'
 * Output:
 *   Number evaluating state, just like
 *   heuristic does.
 */
const minimax = (state, depth, maximizingPlayer) => {
    //console.log("depth", depth);
    //console.log("state", state)
    if (isBaseCase(state, depth)) {
        return heuristic(state, maximizingPlayer)
    } else {
        // Possible states is an array of future states, of
        // the same kind that gets passed into the "state"
        // paramter in minimax.
        //
        // ANY INFORMATION YOU NEED from
        // the "state" object is already
        // pulled from it.
        //console.log('state', state)
        const possibleStates = state.nextStates();
        const minimizingPlayer = maximizingPlayer === 'x' ? 'o' : 'x';
        const currentPlayer = state.nextMovePlayer;
        let newDepth = depth - 1;

        if (currentPlayer === maximizingPlayer) {
            let maxValue = -Infinity
            let maxState;

            for (let i = 0; i < possibleStates.length; i++) {
                let stateValue = minimax(possibleStates[i], newDepth, maximizingPlayer)
                if ( stateValue > maxValue) {
                  maxValue = stateValue
                }
            }

            return maxValue
        } else {
            let minValue = Infinity
            let minState;

            for (let i = 0; i < possibleStates.length; i++) {
                let stateValue = minimax(possibleStates[i], newDepth, maximizingPlayer)
                if ( stateValue < minValue) {
                  minValue = stateValue
                }
            }

            return minValue
        }
        // Reduce to further
        // invocations of minimax.
    }
}


/*
 * minimaxAlphaBeta
 *
 * Input and output are same as for minimax.
 */
const minimaxAlphaBeta = (state, depth, maximizingPlayer) => {

	const minimaxAlphaBetaInner = (state, depth, alpha, beta) => {

        if (isBaseCase(state, depth)) {
            return heuristic(state, maximizingPlayer)
        } else {
            const possibleStates = state.nextStates();
            const minimizingPlayer = maximizingPlayer === 'x' ? 'o' : 'x';
            const currentPlayer = state.nextMovePlayer;
            let newDepth = depth - 1
            if (currentPlayer === maximizingPlayer) {
                let currentAlpha = alpha
                let maxValue = -Infinity
                let value

                for (let i = 0; i < possibleStates.length; i++) {
                    value = minimaxAlphaBetaInner(possibleStates[i], newDepth, alpha, beta)
                    if (value >= maxValue) {
                        maxValue = value
                    }
                    if (value >= alpha) {
                        alpha = value
                    }

                    if (value >= beta) {
                        break
                    }
                }
                return maxValue
            } else {
                let minValue = Infinity
                let value

                for (let i = 0; i < possibleStates.length; i++) {
                    value = minimax(possibleStates[i], newDepth, maximizingPlayer, alpha, beta)
                    if (value <= minValue) {
                      minValue = value
                    }

                    if (value <= beta) {
                        beta = value
                    }

                    if (value <= alpha) {
                        break
                    }
                }
                return minValue
            }


            // Reduce further.
            //let currentAlpha be -100
        }
	}

	return minimaxAlphaBetaInner(state, depth, -1000000000, 1000000000);
}

module.exports = {
    minimaxWrapper,
    minimax,
    minimaxAlphaBeta,
    isBaseCase,
    heuristic
};
