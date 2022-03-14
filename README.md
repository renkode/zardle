# Zardle, a Slightly Better Wordle!

<a href="https://zardle.pages.dev/">Live Demo</a>

<img src="https://cdn.discordapp.com/attachments/871914093865472011/949550199041302548/wordle_4.gif" width="40%" height="40%" />

## Introduction

Made from the ground up with React, Typescript and Cloudflare's serverless API, this is my first full-stack app that is based on the popular word-guessing game, <a href="https://www.nytimes.com/games/wordle/index.html">Wordle.</a> The goal was to mimic the original UI, UX and game logic as much as possible while iterating upon it with some of my own quality-of-life additions, as well as integrating a backend for practice.

## What's Different?

There are a few new things:

- Toggleable visual word check, which shows you if your current 5-letter guess is NOT a valid word without having to submit
- The ability to export and import data across devices and browsers
- Daily words are hosted on Cloudflare instead of locally, and resets every 12 AM EST

I have many friends across the world that play Wordle, and often the friends who are several hours ahead of me accidentally drop hints while I'm waiting for the game to reset in my timezone. I believe having a universal reset at a time when most of us are active was the best compromise.

## Making the App

This was by the far most complex app I have ever made. As unassuming Wordle looks from the frontend, there is a lot of data moving around as the game progresses. There were a great many hurdles I've faced as a result, which led to a lot of refactoring and headaches. On the bright side, there were a great many firsts, including:

- Typescript and TSX
- Tests with Jest
- Error handling (try and catch)
- Using the Context API for dark mode and hard mode
- React's useRef
- Copying things into clipboard
- String and Array methods such as .some(), .every() and Array.from()
- Deploying the app on Cloudflare and fetching my own API from Cloudflare Workers

I have a tendency to wing things as I go, and so I only started using tests/error handling/Context API halfway through the project. If I had to redo this project all over again (god forbid!) I would definitely plan better and start with these first.

## Conclusion

All in all, while I definitely bit off more than I can chew with this app, I'm very grateful that I learned so much from it! I now see the importance of static typing with TS as opposed to dynamic typing, I'm more aware of React's quirks, my knowledge of string/object/array methods have solidified, I got some hefty practice with CSS, the list goes on. I'm well aware that my code isn't structurally sound and even looks awful in some places, but hey, it works!

## OK, but what does "Zardle" mean?

Don't worry about it!
