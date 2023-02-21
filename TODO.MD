# TODO
## Priority
- [x] Add predictive text or box for adding tags
- [x] Redesign color picker (Especially for mobile)
- [ ] Design analytics page for use with widgets
- [ ] Calendar on desktop needs better design within each day
- [ ] Provide date-specific statistics on calendar page
- [ ] Make a ton of analytical widgets that can be reused based on the data passed to them (Need designs)
- [ ] Make the Overview use react-grid-layout once media queries are figured out
- [ ] Create the analytics page (Need design)

## Can wait
- [ ] Finish TradingView Import. Work on how we may need to refeactor some of the processes (Maybe remove balance and instead add overall P&L OR for those that don't include balance, just make balance = overall P&L)
- [ ] Add the ability for a trade to be OPEN if there is no closed execution (Remember to do this by symbol)

## Bugs (As of 2/20/23)
- [x] Tags on mobile should appear differently
- [x] On individual trade, "Next Trade" & "Previous Trade" should be disabled if at end or beginning (Only happens on initial load)

### Before launch
- [ ] Create a new planetscale DB to separate QA, STG, & PROD branches
- [ ] Should have local DB set up so that changes can be made locally

## 1.0 User Story (Deflux Initial Launch)
- [x] A user should be able to import trades
- [x] A user should be able to view all of their trades and sort them by certain criteria
- [x] A user should be able to look at every execution within a trade, add commentary, tags, and images
- [ ] A user should be able to get analytics on their overall trading strategies (tags)
- [ ] A user should be able to add their trades to a study and get custom analytics based on that study
- [ ] A user should be able to compare studies to their overall account and to other studies
- [ ] A user should be able to get analytics on tags and combinations of tags to provide better insight
- [ ] A user should be able to save their view settings so when they login, their data is presented the way they want
- [ ] A user should be able to get a 7 day free trial (Must put in card info) or "beta pass" to test new features (Card info not required)
- [ ] A user should be able to create a group and invite other members to the group where they can share trades, studies, and define group tags (Or use their own)
- [ ] An admin of a group should be able to assign roles to users within a group with certain permissions (Needs looking into)
- [ ] Users should be able to comment on trades/studies within a group and recieve notifications when new information is posted in the group
- [ ] If enabled, users should be able to see leaderboards of the most profitable trader that day/week/month/year/all and trade of the day/week/month/year/all
- [ ] Groups should be able to hold internal competitions over a given timeframe and asset class.
- [ ] Group members with certain permissions will be able to make posts about a certain setup they are looking for and tag it with an asset and potential group trade tags
- [ ] If enabled, users will be able to view other traders profiles (Trading profile can be customized to show what you want)

### After completion enter beta period (3 to 6 months)

## 2.0 User Story (Premium Groups & Learning Center Update)
- [ ] Depending on the platform, a user should be able to see their trades live using API integration (no legal issues here, just ease of use)
- [ ] Groups can enable these features barring legal issues (Probably not happening unless we get a really good lawyer)
- [ ] A user should be able to participate in various competitions with certain prizes
- [ ] A user should be able to create a premium group where they can charge members to get access to their trading strategies
- [ ] Premium groups will launch alongside the learning center and the verification process which will verify highly proficient traders and boost their groups
- [ ] Premium groups will have a minimum requirement of $10 a month and will gain access to the learning center
- [ ] The learning center will be where the group leader (or others with learning center permission) can teach their strategies based on the group tags
- [ ] Groups should be able to compete in competitions to prove their dominance over a certain asset class. (This will naturally promote groups who perform well)
- [ ] Badges may be introduced later on in this update and can be earned by individuals and groups competing in competitions or showing consistency with certain assets / asset classes
- [ ] Badges can be displayed on a user or groups trading profile to show their dominance

### After completion allow certain users (Based on certain criteria) to access beta

## 3.0 User Story (Live Group Trading Update)
### These are all hypothetical until we get legal issues sorted out ##
- [ ] A user should be able to see people live trading within a group if they enable the ability to share their live trades within that group
- [ ] A user should be able to see a heatmap of where traders are entering and exiting based on a certain asset class
- [ ] If a user enters a trade around an area where many users have entered, (if they have notifications on) they will get an alert when other users begin to exit (Maybe limit this to if they have the same group tags)
-- More Coming Soon