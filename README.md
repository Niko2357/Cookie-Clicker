# Chachamaru catch
Game works on a cookie clicker principle. The player earns cookies by clicking on a Chachamaru (cat) that is able to be invisible on meow. User can purchase upgrades with real money that increase cookie production over time. Manipulates with DOM and basic game mechanics (upgrades, costs, multipliers). 

## Bank
Ensures bank transactions and transfers money between two accounts. In this example money from user, who brought game currency. Transaction is communicated to external server (Just Click game) using secure webhooks. Firstly bank server accepts a transfer request from external 
source and confirms acceptance. Then processes the transaction with simulated delay (account confirmations, etc.). Finally it notifies the requesting system about results by webhook. All data are stored in memory while the server is running.
#### The application overview:
1. Express HTTP server
2. Account storage
3. Transfer endpoint
4. Notification system
5. Cryptographic signature mechanism for verification
#### Account system:
* Internal account
    * player_account
        * Player's internal bank account
        * Default balance is set
    * game_account
        * Game external account
        * Starts with zero value
#### API Endpoins:
1. **POST** */transfer*
   ```json
     {
      "transactionId": "string",
      "from": "player_account",
      "to": "game_account",
      "amount": 100,
      "callbackUrl": "https://example.com/webhook"
    }
   ```
   Response:
   ```json
      HTTP 202
      { "status": "ACCEPTED" }

3. **GET** */accounts*
   ```json
     {
      "player_account": {
      "id": "player_account",
      "balance": 1000000000
      },
      "game_account": {
      "id": "game_account",
      "balance": 0
      }
    }
   ```
   Response:
   ```json
     {
        "player_account": { "balance": 999500 },
        "game_account": { "balance": 500 }
     }

#### Webhook Security:
All webhooks have request secured by signature HMAC-SHA256. It's sent in X-Signature HTTP header.

### Used Mechanics
* REST API
    * Respresenational State Transfer Application Programming Interface allows different applications to communicate with each other over HTTP. While using methods such as GET and POST. Each request is sent to a specific URL (endpoint) and exchanges data in JSON. 
* Webhook
    * Webhook sends data to another server automatically when new event or change occurs. The client doesn't have to ask server whether task is finished, however server will notify client when that happens. Here transfers aren't finished immediately, that's the reason webhook is used.
* Error handling
    * Detects invalid input, prevents invalid operations and reacts to them with error messages or can throw an exception. In this project, it also handles the situation of low balance. If account does not contain needed balance the transfer fails.
### Functions

### Required libraries
* express
  ```
  npm i express
  ```
* node and node-fetch
  ```
  npm init -y
  npm install node-fetch
  ```

### Project Authors
* [Vilma Tomanová](https://github.com/notvivi) - Game frontend developer
* [Anna Marie Mičková](https://github.com/annamickova) - Bank transaction developer
* [Jan Vavroušek](https://github.com/JenikBranik) - Game backend developer
* [Nikola Poláchová](https://github.com/Niko2357) - Documentation and complementation
