# kanajolt

A little game I made to help learn the Japanese kana: https://kanajolt.mispy.me/

### Design notes

I started thinking about whether I could write a simple program that would show me a character and tell me if I identified it correctly, for my own practice. Initially I thought about just making an interactive CLI thing, before remembering that static web apps are about as easy as that, and then I could share it as well.

The Pokémon theme came from wondering whether I could give it a cute context to aid memorization. Making something a Pokémon fan project gives you access to both a shared cultural space and a nice dataset of names, sprites, statistics and ideas to play with, so it's often been my default for prototyping.

The initial prototype simply asked you to type the romaji transliteration of each name. This was useful for practicing speed, but not learning, and didn't work well on mobile! So after testing with a friend I switched to a multiple choice input inspired by Duolingo.
