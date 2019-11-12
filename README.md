# v5.1-example-box

This box is meant to provide an illustration of several of the new features
included with Truffle v5.1.

## How to try this out

1. Uninstall any old version of Truffle you might have and install v5.1:
   ```
   $ npm uninstall -g truffle
   $ npm install -g truffle@^5.1.0
   ```

2. Make sure you're in an empty directory and unbox this project:
   ```
   $ truffle unbox v5.1-example
   ```

3. Explore the contracts, the migrations files, and the tests!

Read on for more.

## ENS support

The first feature to note is Truffle's support of ENS name resolution and
address setting. If you own an ENS name, you may use the deployer to set the
resolution address using the `deployer.ens.setAddress` method.

See an example how this is used in
[`migrations/3_set_names.js`](https://github.com/truffle-box/v5.1-example-box/blob/master/migrations/3_set_names.js):
```javascript
  // set ENS name for a few participants
  await deployer.ens.setAddress(
    "alice.name", accounts[0], { from: accounts[0] }
  );
  await deployer.ens.setAddress(
    "bob.name", accounts[1], { from: accounts[0] }
  );
  await deployer.ens.setAddress(
    "calhoun.name", accounts[2], { from: accounts[0] }
  );
```

Here, assuming `accounts[0]` owns the specified names, this will
set the address to which those names resolve when used in place of an address.

Note that if you are using a local test net, (**such as when running `truffle
test`**) Truffle will automatically give the necessary permissions for the
`from` address to set the resolution address.

After setting the resolution addresses for those names, you can then supply
those names in place of address function arguments and Truffle will
automatically resolve them. You can see examples of this in
[`test/guestbook.js`](https://github.com/truffle-box/v5.1-example-box/blob/master/test/guestbook.js#L50-L51)
where `multi.guestbook` and `bob.name` are used in function calls.

Please see Truffle's
[ENS docs](https://www.trufflesuite.com/docs/truffle/advanced/ethereum-name-service)
for more information about this feature.


## In-test Debugging

The next highlighted feature in this box is the in-test debugging. This feature
makes the global function `debug()` available in your tests. To see this in
action, go ahead and wrap a @truffle/contract operation with this new function.

For example, to debug a transaction, change which line is commented out
[here](https://github.com/truffle-box/v5.1-example-box/blob/80ead1ca90b10dfe3e195e5553cd526e4ab9894f/test/guestbook.js#L22-L29):
```javascript
    /*
     * sign guestbook's own guestbook using ENS name for both function
     * parameter and tx parameter
     *
     * to debug this transaction: comment this out and uncomment the next line
     */
    await guestbook.sign("multi.guestbook", message, { from: "alice.name" });
    // await debug(guestbook.sign("multi.guestbook", message, { from: "alice.name" }));
```

Similarly, debug a call by swapping the commented-out line
[here](https://github.com/truffle-box/v5.1-example-box/blob/master/test/guestbook.js#L31-L38):
```javascript
    /*
     * read guestbook signatures via external view
     *
     * to debug this call: comment this out and uncomment the line below,
     * run `truffle test --debug`
     */
    const signatures = await guestbook.signatures("multi.guestbook");
    // const signatures = await debug(guestbook.signatures("multi.guestbook"));
```

In either case, run `truffle test --debug`. It will then start to run the test
suite and start the debugger at that line in the code. You can then use the
debugger controls to step through the code as you would normally!


## For technical users: new decoder

One last item of note is the use of the new, improved decoder package. For
those of you that want to dig in deeper, check out its uses in
[`test/helpers.js`](https://github.com/truffle-box/v5.1-example-box/blob/master/test/helpers.js).
For even more in-depth information about @truffle/decoder, check out out the
[documentation](https://www.trufflesuite.com/docs/truffle/codec/index.html).
