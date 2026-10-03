/* ==========================================================================
   Coding Through Games — activity content
   All question banks + maze levels live here so pages stay thin.

   NOTE ON DIFFICULTY: every activity is written for school students in the
   age band stated in the project plan (roughly Class 6-9) with no prior
   programming experience. Explanations are deliberately plain-language and
   avoid jargon; where a technical term is unavoidable it is explained inline.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. ALGORITHM MAZE
     Grid legend:  S = start, G = goal, # = wall, . = open path
     The engine computes the shortest route with BFS, so the star rating
     compares the student's command count against the true optimum.
     ------------------------------------------------------------------ */
  var MAZE = {
    slug: 'algorithm-maze',
    title: 'Algorithm Maze',
    concept: 'Algorithm · Sequence',
    intro: 'An algorithm is simply a list of steps, in the right order. Drive the robot to the star by building a list of commands — nothing happens until you press Run.',
    instructions: [
      'Press the arrow buttons to add moves to your command list.',
      'Press Run to watch the robot follow your list, one step at a time.',
      'If the robot hits a wall, it stops — that is your algorithm telling you a step is wrong.',
      'Fewer commands is better. Your star rating compares your list with the shortest possible list.'
    ],
    tip: 'Think first, then click. Write the whole route in your head before you start adding steps.',
    levels: [
      {
        name: 'Level 1 — Straight Lines',
        grid: [
          'S.....',
          '.####.',
          '......',
          '.####.',
          '......',
          '.....G'
        ]
      },
      {
        name: 'Level 2 — Turn in the Middle',
        grid: [
          'S.#....',
          '..#....',
          '.#.....',
          '.......',
          '.#####.',
          '.......',
          '......G'
        ]
      },
      {
        name: 'Level 3 — The Spiral',
        grid: [
          'S.......',
          '.#####.#',
          '.#...#.#',
          '.#.#.#.#',
          '.#.#...#',
          '.#.#####',
          '.#......',
          '.######G'
        ]
      }
    ]
  };

  /* ------------------------------------------------------------------
     2. FIND THE BUG
     ------------------------------------------------------------------ */
  var BUG = {
    slug: 'find-the-bug',
    title: 'Find the Bug',
    concept: 'Debugging · Logical errors',
    intro: 'A bug is a mistake in a program. Sometimes the computer still runs the program, but the answer comes out wrong. Can you spot which line is doing the damage?',
    instructions: [
      'Read the program carefully — every line, not just the first one.',
      'Decide which line contains the mistake.',
      'Choose your answer, then read the explanation to see why.',
      'Try to say the reason out loud before you click — that is what real programmers do.'
    ],
    tip: 'Read the program as if you were the computer: do exactly what each line says, in order.',
    questions: [
      {
        stem: 'The program should print 10, but it prints 2.',
        prompt: 'Which line has the bug?',
        code: [
          '1  set a = 4',
          '2  set b = 6',
          '3  set answer = b - a',
          '4  print answer'
        ].join('\n'),
        options: [
          'Line 1 — a is set to 4',
          'Line 3 — it subtracts instead of adding',
          'Line 4 — print is the wrong instruction',
          'Line 2 — b should be larger'
        ],
        answer: 1,
        explain: 'Line 3 says b - a, which is 6 - 4 = 2. The program wants 4 + 6 = 10, so the instruction on line 3 is wrong: it should be a + b. The values themselves are fine.'
      },
      {
        stem: 'These steps make tea. Something is clearly in the wrong order.',
        prompt: 'Which step is in the wrong place?',
        code: [
          '1  boil water',
          '2  pour water into the cup',
          '3  put the tea bag into the cup',
          '4  add milk and stir'
        ].join('\n'),
        options: [
          'Step 1 — water should be boiled last',
          'Step 3 — the tea bag should go in before the water is poured',
          'Step 4 — milk should never be added',
          'Nothing is wrong'
        ],
        answer: 1,
        explain: 'Pouring water into an empty cup (step 2) then dropping in a tea bag (step 3) gives weak tea. The tea bag belongs in the cup before the hot water arrives. Computers care about order for exactly the same reason.'
      },
      {
        stem: 'The program should print 6 (the total of 1 + 2 + 3), but it prints 7.',
        prompt: 'Which line is the problem?',
        code: [
          '1  set total = 1',
          '2  set total = total + 1',
          '3  set total = total + 2',
          '4  set total = total + 3',
          '5  print total'
        ].join('\n'),
        options: [
          'Line 1 — total starts at 1, so the first 1 is counted twice',
          'Line 2 — the wrong number is added',
          'Line 4 — 3 is added one time too many',
          'Nothing is wrong'
        ],
        answer: 0,
        explain: 'The numbers to be added are 1, 2 and 3, so the running total must start at 0. Because line 1 already puts 1 into total, that 1 ends up counted twice — giving 7 instead of 6. Starting a total at 0 and then adding each number in turn is the standard pattern.'
      },
      {
        stem: 'The program should print every even number from 1 to 6, so: 2 4 6. It prints nothing at all.',
        prompt: 'Which line is the bug?',
        code: [
          '1  for n = 1 to 6',
          '2      if n / 2 = 0 then',
          '3          print n',
          '4      end if',
          '5  end for'
        ].join('\n'),
        options: [
          'Line 2 — using / instead of remainder, so the test is never true',
          'Line 3 — print n is too short',
          'Line 5 — the loop should stop at 3',
          'Line 1 — 1 to 6 should be 0 to 6'
        ],
        answer: 0,
        explain: 'Dividing any number by 2 only gives 0 when the number is 0 — which never happens here, so the condition on line 2 is always false and the print inside never runs. To ask "is this number even?" you need the remainder (n mod 2 = 0), not ordinary division.'
      },
      {
        stem: 'This program should count how many students passed the test. Read it very carefully.',
        prompt: 'Is there a bug in this program?',
        code: [
          '1  set count = 0',
          '2  for each student in the list',
          '3      if student passed then',
          '4          set count = count + 1',
          '5  print count'
        ].join('\n'),
        options: [
          'Line 1 — count should start at 1',
          'Line 4 — it should add 2, not 1',
          'Line 2 — a loop cannot be used here',
          'This program is correct — it counts the students who passed'
        ],
        answer: 3,
        explain: 'Trace it: count starts at 0, and every student who passed adds 1. The program therefore counts exactly how many passed, so it is correct. Spotting a correct program matters just as much as spotting a broken one — beginners often "fix" code that was already working and introduce a real bug by doing so.'
      }
    ]
  };

  /* ------------------------------------------------------------------
     3. IF–ELSE CHALLENGE
     ------------------------------------------------------------------ */
  var IFELSE = {
    slug: 'if-else-challenge',
    title: 'If–Else Challenge',
    concept: 'Conditions · Decisions',
    intro: 'If–else lets a program choose a path: "if this is true, do this; otherwise do that". Trace each rule and predict which path the program takes.',
    instructions: [
      'Read the rules from the top down.',
      'Work out the values first, then test them against each condition in order.',
      'Choose the path the program will actually take.',
      'Check the explanation to see where most students slip.'
    ],
    tip: 'Conditions are checked one after another. The first one that is true wins and the rest are skipped.',
    questions: [
      {
        stem: 'A school gate opens for students in Class 8 or above.',
        prompt: 'A student in Class 7 arrives. What does the program do?',
        code: [
          'set class = 7',
          'if class >= 8 then',
          '    print "Gate opens"',
          'else',
          '    print "Please wait"',
          'end if'
        ].join('\n'),
        options: [
          'Prints "Gate opens"',
          'Prints "Please wait"',
          'Prints both lines',
          'Prints nothing'
        ],
        answer: 1,
        explain: 'class is 7. The test 7 >= 8 is false, so the if branch is skipped and the else branch runs. The program prints "Please wait".'
      },
      {
        stem: 'A game gives a bonus if a player scores above 50. The player scores exactly 50.',
        prompt: 'Which message appears?',
        code: [
          'set score = 50',
          'if score > 50 then',
          '    print "Bonus!"',
          'else',
          '    print "No bonus"',
          'end if'
        ].join('\n'),
        options: [
          'Bonus!',
          'No bonus',
          'Both messages',
          'The program crashes'
        ],
        answer: 1,
        explain: 'The condition is score > 50 (strictly greater than). Exactly 50 is not greater than 50, so the else branch runs. If the rule had been written score >= 50 the bonus would appear. This difference catches a lot of people.'
      },
      {
        stem: 'A vending machine picks a snack based on the money inserted.',
        prompt: 'The student inserts 20. What is printed?',
        code: [
          'set money = 20',
          'if money >= 30 then',
          '    print "Chips"',
          'else if money >= 15 then',
          '    print "Biscuit"',
          'else',
          '    print "Not enough money"',
          'end if'
        ].join('\n'),
        options: [
          'Chips',
          'Biscuit',
          'Not enough money',
          'Chips and Biscuit'
        ],
        answer: 1,
        explain: 'money is 20. First test: 20 >= 30 is false. Second test: 20 >= 15 is true, so "Biscuit" is printed and the rest is skipped. Notice the program checks the conditions strictly from top to bottom.'
      },
      {
        stem: 'Two conditions are joined with AND. Both must be true for the branch to run.',
        prompt: 'The subject is a quiz AND the student has logged in. Which line is printed?',
        code: [
          'set subject = "quiz"',
          'set attendance = 100',
          'if subject = "quiz" AND attendance >= 75 then',
          '    print "Chapter 1 unlocked"',
          'else',
          '    print "Chapter locked"',
          'end if'
        ].join('\n'),
        options: [
          'Chapter 1 unlocked',
          'Chapter locked',
          'Nothing is printed',
          'An error message'
        ],
        answer: 0,
        explain: 'AND means both parts must be true. "quiz" = "quiz" is true, and 100 >= 75 is also true. Both are true, so the whole condition is true and the unlock message prints.'
      },
      {
        stem: 'Two conditions are joined with OR. Only one of them needs to be true.',
        prompt: 'The library is open on Saturday, but closed on Sunday. What is printed?',
        code: [
          'set day = "Sunday"',
          'if day = "Saturday" OR day = "Sunday" then',
          '    print "Library open"',
          'else',
          '    print "Library closed"',
          'end if'
        ].join('\n'),
        options: [
          'Library open',
          'Library closed',
          'Both messages',
          'Nothing is printed'
        ],
        answer: 0,
        explain: 'day equals "Sunday", so the second half of the OR is true. With OR, one true part is enough to make the whole condition true — so the program prints "Library open", even though Sunday was meant to be a closed day. This is exactly why the programmer must be careful when choosing AND or OR.'
      }
    ]
  };

  /* ------------------------------------------------------------------
     4. PATTERN DETECTIVE
     ------------------------------------------------------------------ */
  var PATTERN = {
    slug: 'pattern-detective',
    title: 'Pattern Detective',
    concept: 'Loops · Repeats',
    intro: 'Computers are wonderful at repeating things. Find the rule in each pattern and work out what comes next.',
    instructions: [
      'Look at the numbers or shapes given.',
      'Work out how each one leads to the next one.',
      'Choose what belongs in the next position.',
      'Read the explanation to see the rule written down as a loop.'
    ],
    tip: 'Ask two questions: "how much does it change each time?" and "does it change by adding, or by multiplying?"',
    questions: [
      {
        stem: 'The pattern repeats: 2, 4, 6, 8, ...',
        prompt: 'What comes next?',
        options: ['9', '10', '12', '11'],
        answer: 1,
        explain: 'Each number is the previous one plus 2 — the even numbers. 8 + 2 = 10. As a loop this would be written: for n = 2 to 20 step 2.'
      },
      {
        stem: 'The pattern doubles each time: 3, 6, 12, 24, ...',
        prompt: 'What comes next?',
        options: ['30', '36', '48', '27'],
        answer: 2,
        explain: 'Each number is the one before it multiplied by 2. 24 × 2 = 48. Adding would have given 36 — a very common mistake, so always check which rule is actually being used.'
      },
      {
        stem: 'The pattern counts down: 20, 17, 14, 11, ...',
        prompt: 'What comes next?',
        options: ['9', '8', '10', '7'],
        answer: 1,
        explain: 'Each number is 3 less than the previous one: 11 - 3 = 8. In loop form: for n = 20 down to 2 step -3.'
      },
      {
        stem: 'The pattern grows: 1, 1, 2, 3, 5, 8, ...',
        prompt: 'What comes next?',
        options: ['11', '13', '12', '16'],
        answer: 1,
        explain: 'Each number is the sum of the previous two: 5 + 8 = 13. This famous pattern is called the Fibonacci sequence, and it appears in nature in flower petals and pine cones.'
      },
      {
        stem: 'A shape pattern repeats in a loop of three: ▲ ● ■ ▲ ● ■ ...',
        prompt: 'What is the 10th shape?',
        options: ['▲', '●', '■', 'It cannot be worked out'],
        answer: 0,
        explain: 'The loop repeats every 3 shapes. 10 ÷ 3 = 3 full repeats (9 shapes) with 1 left over — so the 10th shape is the first shape of the pattern: ▲. Programmers write this as "position mod 3".'
      }
    ]
  };

  /* ------------------------------------------------------------------
     5. GUESS THE OUTPUT
     ------------------------------------------------------------------ */
  var OUTPUT = {
    slug: 'guess-output',
    title: 'Guess the Output',
    concept: 'Variables · Tracing',
    intro: 'A variable is a labelled box that stores a value — and the value can change while the program runs. Be the computer and work out exactly what gets printed.',
    instructions: [
      'Read the program from the first line to the last.',
      'Keep track of what is inside each variable after every line.',
      'Choose the output you expect.',
      'If you were wrong, follow the explanation line by line.'
    ],
    tip: 'Use a scrap of paper. Write the variable name, then cross out the old value each time it changes.',
    questions: [
      {
        stem: 'Follow the variable x.',
        prompt: 'What is printed?',
        code: [
          'set x = 5',
          'set x = x + 3',
          'set x = x * 2',
          'print x'
        ].join('\n'),
        options: ['11', '16', '13', '10'],
        answer: 1,
        explain: 'x starts at 5. After x = x + 3 it holds 8. After x = x * 2 it holds 16. Printed: 16. Notice how the same box is reused, and the old value is replaced each time.'
      },
      {
        stem: 'A counting loop adds to a total.',
        prompt: 'What is printed?',
        code: [
          'set total = 0',
          'for n = 1 to 4',
          '    set total = total + n',
          'end for',
          'print total'
        ].join('\n'),
        options: ['4', '10', '24', '9'],
        answer: 1,
        explain: 'total grows like this: 0 + 1 = 1, then 1 + 2 = 3, then 3 + 3 = 6, then 6 + 4 = 10. Printed: 10. (Option 24 would be the answer to 1 × 2 × 3 × 4 — a different job entirely.)'
      },
      {
        stem: 'Two strings are joined together.',
        prompt: 'What is printed?',
        code: [
          'set first = "Good"',
          'set second = "Morning"',
          'print first + second'
        ].join('\n'),
        options: ['Good Morning', 'GoodMorning', 'MorningGood', 'An error'],
        answer: 1,
        explain: 'Joining two pieces of text glues them together exactly as they are — there is no space added for you. The output is "GoodMorning". If a space is wanted, it has to be written in: first + " " + second.'
      },
      {
        stem: 'Watch how the variable changes on every pass of the loop.',
        prompt: 'What is printed after the loop finishes?',
        code: [
          'set count = 10',
          'for i = 1 to 3',
          '    set count = count - 2',
          'end for',
          'print count'
        ].join('\n'),
        options: ['4', '6', '8', '5'],
        answer: 0,
        explain: 'The loop runs three times and subtracts 2 each time: 10 → 8 → 6 → 4. Printed: 4. The loop counter i is never used here — only count changes.'
      },
      {
        stem: 'A small program decides what to print.',
        prompt: 'What is printed?',
        code: [
          'set marks = 38',
          'set pass = 40',
          'if marks >= pass then',
          '    print "Passed"',
          'else',
          '    print "Try again"',
          'end if'
        ].join('\n'),
        options: ['Passed', 'Try again', 'Both', 'Nothing'],
        answer: 1,
        explain: 'marks is 38 and pass is 40. The test 38 >= 40 is false, so the else branch runs and "Try again" is printed. Comparing two variables (rather than a variable and a fixed number) works exactly the same way.'
      }
    ]
  };

  window.CTG_DATA = {
    'algorithm-maze': MAZE,
    'find-the-bug': BUG,
    'if-else-challenge': IFELSE,
    'pattern-detective': PATTERN,
    'guess-output': OUTPUT
  };
})();
