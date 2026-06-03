# English Town Journey — Vertical World Layout

A single vertical isometric journey (~8200px tall) built from the CSV lesson ORDER.
Lesson 1 is at the **bottom** (yPercent≈96); the winding road climbs to lesson 60 at
the **top** (yPercent≈5). Lessons are grouped into **10 TOPICS**
(from the CSV `topic` column) — each an isometric town zone with matching buildings.

- Positions: `src/utils/mapLayout.ts` (percent → pixels, road, buildings, props).
- Topic themes: `src/data/topicZones.ts`. Lesson data: `src/data/subtopics.ts`.


## Topic 1 — Everyday Life
Lessons 1–7

| id | lesson | location | town visual (building/prop) | xPercent | yPercent | previous | next |
|----|--------|----------|------------------------------|----------|----------|----------|------|
| 1 | Meet & Greet New People | Town Square | Town plaza with a fountain | 50 | 96 | — (start) | #2 Talk about Yourself |
| 2 | Talk about Yourself | Park Bench | Green park with benches & trees | 60.2 | 94.5 | #1 Meet & Greet New People | #3 Make New Friends |
| 3 | Make New Friends | Cafe Corner | Cosy cafe with awning | 62.7 | 92.9 | #2 Talk about Yourself | #4 Say "Thank You" |
| 4 | Say "Thank You" | Gift Shop | Gift shop with balloons | 55.6 | 91.4 | #3 Make New Friends | #5 Discuss Daily Routine |
| 5 | Discuss Daily Routine | Home - Living Room | Cosy family house | 44.2 | 89.8 | #4 Say "Thank You" | #6 Say "Please" & "Excuse Me" |
| 6 | Say "Please" & "Excuse Me" | Bus Stop | Bus stop shelter | 37.3 | 88.3 | #5 Discuss Daily Routine | #7 Saying "Goodbye" |
| 7 | Saying "Goodbye" | Town Gate | Decorative town gate arch | 40 | 86.7 | #6 Say "Please" & "Excuse Me" | #8 Talk to Father |

> 🎉 Topic milestone after lesson 7: **+50 ⭐** + topic completion celebration.

## Topic 2 — My Family
Lessons 8–14

| id | lesson | location | town visual (building/prop) | xPercent | yPercent | previous | next |
|----|--------|----------|------------------------------|----------|----------|----------|------|
| 8 | Talk to Father | Home - Living Room | Cosy family house | 50.2 | 85.2 | #7 Saying "Goodbye" | #9 Talk to Mom |
| 9 | Talk to Mom | Home - Kitchen | Cosy family house | 60.3 | 83.7 | #8 Talk to Father | #10 Plan a Trip with Sibling |
| 10 | Plan a Trip with Sibling | Home - Bedroom | Cosy family house | 62.6 | 82.1 | #9 Talk to Mom | #11 Say "Sorry" |
| 11 | Say "Sorry" | Home - Doorway | Cosy family house | 55.4 | 80.6 | #10 Plan a Trip with Sibling | #12 Talk at Dinner |
| 12 | Talk at Dinner | Home - Dining Table | Cosy family house | 44.1 | 79 | #11 Say "Sorry" | #13 Visiting a Park |
| 13 | Visiting a Park | Neighbourhood Park | Green park with benches & trees | 37.2 | 77.5 | #12 Talk at Dinner | #14 Ask for Help from Relative |
| 14 | Ask for Help from Relative | Home - Balcony | Cosy family house | 40.1 | 75.9 | #13 Visiting a Park | #15 Make a booking |

> 🎉 Topic milestone after lesson 14: **+50 ⭐** + topic completion celebration.

## Topic 3 — Talk at Restaurant
Lessons 15–20

| id | lesson | location | town visual (building/prop) | xPercent | yPercent | previous | next |
|----|--------|----------|------------------------------|----------|----------|----------|------|
| 15 | Make a booking | Restaurant - Host Desk | Restaurant with outdoor seating | 50.4 | 74.4 | #14 Ask for Help from Relative | #16 Arriving at the restaurant |
| 16 | Arriving at the restaurant | Restaurant - Entrance | Restaurant with outdoor seating | 60.4 | 72.9 | #15 Make a booking | #17 Asking for the menu |
| 17 | Asking for the menu | Restaurant - Table (Menu) | Restaurant with outdoor seating | 62.6 | 71.3 | #16 Arriving at the restaurant | #18 Order food & drinks |
| 18 | Order food & drinks | Restaurant - Table (Ordering) | Restaurant with outdoor seating | 55.2 | 69.8 | #17 Asking for the menu | #19 Asking for bill |
| 19 | Asking for bill | Restaurant - Billing Counter | Restaurant with outdoor seating | 43.9 | 68.2 | #18 Order food & drinks | #20 Feedback before leaving |
| 20 | Feedback before leaving | Restaurant - Exit | Restaurant with outdoor seating | 37.2 | 66.7 | #19 Asking for bill | #21 Welcome new neighbour |

> 🎉 Topic milestone after lesson 20: **+50 ⭐** + topic completion celebration.

## Topic 4 — Talk to Friends
Lessons 21–26

| id | lesson | location | town visual (building/prop) | xPercent | yPercent | previous | next |
|----|--------|----------|------------------------------|----------|----------|----------|------|
| 21 | Welcome new neighbour | Neighbour's Doorstep | Cosy family house | 40.2 | 65.2 | #20 Feedback before leaving | #22 Make weekend plan |
| 22 | Make weekend plan | Cafe / Hangout | Cosy cafe with awning | 50.7 | 63.6 | #21 Welcome new neighbour | #23 Make movie plan |
| 23 | Make movie plan | Cinema | Cinema with marquee | 60.6 | 62.1 | #22 Make weekend plan | #24 Invite friends to home |
| 24 | Invite friends to home | Home - Living Room | Cosy family house | 62.5 | 60.5 | #23 Make movie plan | #25 Talk over phone |
| 25 | Talk over phone | Home - Phone Corner | Cosy family house | 55 | 59 | #24 Invite friends to home | #26 Discuss hobbies |
| 26 | Discuss hobbies | Park / Garden | Green park with benches & trees | 43.7 | 57.4 | #25 Talk over phone | #27 Make a plan |

> 🎉 Topic milestone after lesson 26: **+50 ⭐** + topic completion celebration.

## Topic 5 — Travel
Lessons 27–32

| id | lesson | location | town visual (building/prop) | xPercent | yPercent | previous | next |
|----|--------|----------|------------------------------|----------|----------|----------|------|
| 27 | Make a plan | Home - Study Desk | Cosy family house | 37.2 | 55.9 | #26 Discuss hobbies | #28 Packing for the trip |
| 28 | Packing for the trip | Home - Bedroom | Cosy family house | 40.4 | 54.4 | #27 Make a plan | #29 Book a taxi |
| 29 | Book a taxi | Taxi Stand | Taxi stand with cab | 50.9 | 52.8 | #28 Packing for the trip | #30 Asking for directions |
| 30 | Asking for directions | Crossroads | Road crossroads with signpost | 60.7 | 51.3 | #29 Book a taxi | #31 Talk about destination |
| 31 | Talk about destination | Tourist Landmark | Tourist monument | 62.4 | 49.7 | #30 Asking for directions | #32 Talk to other tourists |
| 32 | Talk to other tourists | Tourist Cafe | Cosy cafe with awning | 54.8 | 48.2 | #31 Talk about destination | #33 Meeting a new colleague |

> 🎉 Topic milestone after lesson 32: **+50 ⭐** + topic completion celebration.

## Topic 6 — At Work
Lessons 33–38

| id | lesson | location | town visual (building/prop) | xPercent | yPercent | previous | next |
|----|--------|----------|------------------------------|----------|----------|----------|------|
| 33 | Meeting a new colleague | Office - Reception | Office building | 43.5 | 46.6 | #32 Talk to other tourists | #34 Helping colleague with a task |
| 34 | Helping colleague with a task | Office - Workstation | Office building | 37.1 | 45.1 | #33 Meeting a new colleague | #35 Talk at lunch |
| 35 | Talk at lunch | Office - Cafeteria | Cosy cafe with awning | 40.5 | 43.6 | #34 Helping colleague with a task | #36 Asking for leave |
| 36 | Asking for leave | Manager's Cabin | Office building | 51.1 | 42 | #35 Talk at lunch | #37 Asking for promotion |
| 37 | Asking for promotion | Conference Room | Office building | 60.8 | 40.5 | #36 Asking for leave | #38 Asking for a raise |
| 38 | Asking for a raise | HR Office | Office building | 62.4 | 38.9 | #37 Asking for promotion | #39 Going for shopping |

> 🎉 Topic milestone after lesson 38: **+50 ⭐** + topic completion celebration.

## Topic 7 — Shopping
Lessons 39–43

| id | lesson | location | town visual (building/prop) | xPercent | yPercent | previous | next |
|----|--------|----------|------------------------------|----------|----------|----------|------|
| 39 | Going for shopping | Market Entrance | Open market entrance | 54.5 | 37.4 | #38 Asking for a raise | #40 Grocery shopping |
| 40 | Grocery shopping | Grocery Store | Grocery store with produce | 43.3 | 35.8 | #39 Going for shopping | #41 Buy clothes |
| 41 | Buy clothes | Clothing Store | Clothing boutique | 37.1 | 34.3 | #40 Grocery shopping | #42 Bargain while shopping |
| 42 | Bargain while shopping | Bargain Stall | Street bargain stall | 40.7 | 32.8 | #41 Buy clothes | #43 Paying the bill |
| 43 | Paying the bill | Billing Counter | Shop billing counter | 51.3 | 31.2 | #42 Bargain while shopping | #44 Talk at parties |

> 🎉 Topic milestone after lesson 43: **+50 ⭐** + topic completion celebration.

## Topic 8 — Social Interactions
Lessons 44–48

| id | lesson | location | town visual (building/prop) | xPercent | yPercent | previous | next |
|----|--------|----------|------------------------------|----------|----------|----------|------|
| 44 | Talk at parties | Party Hall Entrance | Party hall with lights | 60.9 | 29.7 | #43 Paying the bill | #45 Plan a group outing |
| 45 | Plan a group outing | Party Hall | Party hall with lights | 62.3 | 28.1 | #44 Talk at parties | #46 Offer help to others |
| 46 | Offer help to others | Tea Table | Green park with benches & trees | 54.3 | 26.6 | #45 Plan a group outing | #47 Give & take compliments |
| 47 | Give & take compliments | Garden Terrace | Green park with benches & trees | 43.1 | 25.1 | #46 Offer help to others | #48 Express Thanks |
| 48 | Express Thanks | Discussion Corner | Green park with benches & trees | 37.1 | 23.5 | #47 Give & take compliments | #49 Talk at reception |

> 🎉 Topic milestone after lesson 48: **+50 ⭐** + topic completion celebration.

## Topic 9 — At the Hotel
Lessons 49–54

| id | lesson | location | town visual (building/prop) | xPercent | yPercent | previous | next |
|----|--------|----------|------------------------------|----------|----------|----------|------|
| 49 | Talk at reception | Hotel - Reception | Hotel building | 40.8 | 22 | #48 Express Thanks | #50 Asking About Room Facilities |
| 50 | Asking About Room Facilities | Hotel - Room | Hotel building | 51.5 | 20.4 | #49 Talk at reception | #51 In room service |
| 51 | In room service | Hotel - Room (Service) | Hotel building | 61.1 | 18.9 | #50 Asking About Room Facilities | #52 Call housekeeping |
| 52 | Call housekeeping | Hotel - Corridor | Hotel building | 62.2 | 17.3 | #51 In room service | #53 Request a checkout |
| 53 | Request a checkout | Hotel - Checkout Desk | Hotel building | 54.1 | 15.8 | #52 Call housekeeping | #54 Pay the bill |
| 54 | Pay the bill | Hotel - Billing | Shop billing counter | 42.9 | 14.3 | #53 Request a checkout | #55 Book a Flight |

> 🎉 Topic milestone after lesson 54: **+50 ⭐** + topic completion celebration.

## Topic 10 — At the Airport
Lessons 55–60

| id | lesson | location | town visual (building/prop) | xPercent | yPercent | previous | next |
|----|--------|----------|------------------------------|----------|----------|----------|------|
| 55 | Book a Flight | Travel Desk (Booking) | Airport terminal | 37.1 | 12.7 | #54 Pay the bill | #56 Check in at airport |
| 56 | Check in at airport | Airport - Check-in Desk | Airport terminal | 41 | 11.2 | #55 Book a Flight | #57 Asking for window seat |
| 57 | Asking for window seat | Airport - Check-in (Seat) | Airport terminal | 51.7 | 9.6 | #56 Check in at airport | #58 Asking About Flight Status |
| 58 | Asking About Flight Status | Airport - Information Board | Airport terminal | 61.2 | 8.1 | #57 Asking for window seat | #59 Flight Boarding |
| 59 | Flight Boarding | Airport - Boarding Gate | Airport terminal | 62.1 | 6.5 | #58 Asking About Flight Status | #60 Ask for water in flight |
| 60 | Ask for water in flight | Airplane - Cabin | Airplane on the runway | 53.9 | 5 | #59 Flight Boarding | 🏆 English Champion |

> 🎉 Topic milestone after lesson 60: **+50 ⭐** + topic completion celebration.

## 🏆 Finish — English Champion
After lesson 60 the journey ends with the English Champion celebration at the top.
