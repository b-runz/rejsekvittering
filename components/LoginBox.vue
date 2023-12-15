<template>
    <div>
    <!-- Hidden input field to hold the extracted token -->
    <input type="hidden" v-model="extractedToken" />
    
    <!-- Display the extracted token (for demonstration) -->
    <p>Extracted Token: {{ extractedToken }}</p>
  </div>
  
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
const querystring = require('querystring');

@Component
export default class LoginBox extends Vue {
  extractedToken?: string = "";

  async fetch(){
    const response = await this.$axios.get("https://selvbetjening.rejsekort.dk/CWS/Home/UserNameLogin");

    const setCookieHeaders = response.headers['set-cookie'];
    
    // // Process the setCookieHeaders to get individual cookies
    const cookies = setCookieHeaders.map((cookie: string) => cookie.split(';')[0]);
    // console.log(cookies)
    
    // Extracting the token using regular expressions
    const regex = /<input name="__RequestVerificationToken" type="hidden" value="([^"]+)" \/>/;
    const match = response.data.match(regex);

    if (match && match[1]) {
      this.extractedToken = match[1];
      console.log("Extracted Token:", this.extractedToken);
    } else {
      console.log("Token not found");
    }


  }
}
</script>
