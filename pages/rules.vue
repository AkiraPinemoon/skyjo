<template>
    <div class="w-full h-full flex flex-col place-items-center py-16">
        <div class="max-w-3xl w-5/6 text-justify flex flex-col gap-10">
            <h1 class="uppercase text-3xl w-full text-center">The Rules</h1>

            <section class="flex flex-col gap-2">
                <h2 class="uppercase text-2xl">Objective</h2>
                <p>The objective of Skyjo is to achieve the lowest score of all players.</p>

                <h2 class="uppercase text-2xl">Setup</h2>
                <ol class="list-decimal pl-8">
                    <li>
                        <p>The deck consisting of cards from -2 to 12 is shuffled.</p>
                    </li>
                    <li>
                        <p>Each player is dealt 12 cards face down in a 4x3 grid. The remaining cards form the draw
                            pile.
                        </p>
                    </li>
                    <li>
                        <p>Each player flips two of their cards face up.</p>
                    </li>
                </ol>
            </section>

            <section class="flex flex-col gap-2">
                <h2 class="uppercase text-2xl">Gameplay</h2>
                <p>The game is played in turns, with each player performing the following actions:</p>
                <h3 class="uppercase text-xl">On Your Turn</h3>
                <ol class="list-decimal pl-8">
                    <li>
                        <h4 class="uppercase text-lg">Draw a Card:</h4>
                        <ul class="list-disc pl-8">
                            <li>
                                <p>Draw the top card from either the draw pile or the discard pile.</p>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <h4 class="uppercase text-lg">Choose to Replace or Discard:</h4>
                        <ul class="list-disc pl-8">
                            <li>
                                <p>If you drew from the draw pile, you may choose to:</p>
                                <ul class="list-disc pl-8">
                                    <li>
                                        <p>Replace one of your 12 cards (face up or face down) with the drawn card.</p>
                                    </li>
                                    <li>
                                        <p>Place the drawn card on the discard pile without replacing. Then flip one of
                                            your
                                            face down cards.</p>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <p>If you drew from the discard pile, you must replace one of your 12 cards with the
                                    drawn
                                    card.</p>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <h4 class="uppercase text-lg">End of Turn:</h4>
                        <ul class="list-disc pl-8">
                            <li>
                                <p>If you playfield has any column filled with same value cards, place the entire column
                                    on
                                    the discard pile. The next player can't draw from the discard pile.</p>
                            </li>
                        </ul>
                    </li>
                </ol>
            </section>

            <section class="flex flex-col gap-2">
                <h3 class="uppercase text-xl">End of Game</h3>
                <p>The game ends, when a player begins his turn with all of his cards facing up. All players turn all of
                    their cards to face up.</p>
            </section>

            <section class="flex flex-col gap-2">
                <h2 class="uppercase text-2xl">Scoring</h2>
                <p>To determine a players score just add up all of their cards values</p>
            </section>
        </div>
    </div>
</template>
