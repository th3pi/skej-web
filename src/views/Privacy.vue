<template>
  <div id="scrollableHome">
    <div id="mainBody" style="width: 500px">
      <h1>Privacy</h1>
      <section>
        <p>
          <strong>In brief,</strong> Skéj does not track you. Skej
          <strong style="text-decoration: underline">
            does not log or share</strong
          >
          of your personal information.
        </p>
      </section>
      <section>
        <h3>What information Skéj <u>DOES NOT</u> collect?</h3>
        <p>
          Skej does not collect any personal information that can be tracked to
          you or any individual. When you connect to Skéj with your Google
          Account you are not logging into Skej. Skej does not have a user
          database and/or authetication system. You log in with your Google
          account and give Skéj access to interact with your Google Calendar.
          Google handles the authentication and the authenticated session. The
          authentication cookies stored in user's browser are also managed by
          Google.
        </p>
        <h3>What information Skéj <u>DOES</u> collect?</h3>
        <p>
          When a user submits a sentence to Skej only the input it sent to
          <a href="https://wit.ai">Wit.ai</a>'s API to understand and process
          the input using a Natural Language Processing model. The model stores
          those input as training data. However, it only stores
          <strong>only the input</strong> and it is not tied to the user who
          sent the input. <strong>No personal data is collected</strong>.
        </p>
        <h3>Why isn't my input considered "Personal data"?</h3>
        <p>
          Since at no point Skéj tie you and your input together it is not
          considered personal data. For example, if you input
          <i>"I have a CS340 class on Mondays and Tuesdays at 5pm"</i>. Skéj and
          it's Natural Language Processing model is only storing the sentence as
          part of training/its knowledge base. It is just a sentence without any
          personal information that be tied back to you.
        </p>
        <h3>
          How about the information I put in the settings page? Where are you
          storing those?
        </h3>
        <p>
          Those are stored locally in your browser. If you log into another
          computer or even another browser those settings will not carry over as
          they are <i>locally stored.</i> Skej does not at all have a backend
          database where it can store information.
        </p>
        <h3>Do you collect any analytical data to improve services?</h3>
        <p>
          No. As mentioned previously, the only data that is collected is the
          input sentence. Skej does not use Google Analytics either, as there is
          no need for it. The service Skej provides is straight forward.
        </p>
        <h3>How would Skej respond to governmental requests for data?</h3>
        <p>
          <i>If</i> any governmental body requests anything from Skej. I am
          legally obliged to comply. However, it is highly unlikely because
          <i>Skej does not collect any personal data.</i>
        </p>
        <h3>Why does Skéj not collect any personal information?</h3>
        <p>
          Simply because there is no need to. It's just a tool and a hobby
          project for me.
        </p>
        <h3>Got more questions about your privacy?</h3>
        <p>
          Feel free to reach out to me a <strong>tanjim@bhyn.dev</strong> or
          find me on twitter at
          <a href="https://twitter.com/tanjim_b">@tanjim_b</a>.
        </p>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  name: "privacy",
};
</script>
<style lang="scss">
</style>