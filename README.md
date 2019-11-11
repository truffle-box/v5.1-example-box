# v5.1-example-box

This box is meant to provide an illustration of several of the new features
included with Truffle v5.1.

The first feature to note is Truffle's support of ENS name resolution and
address setting. If you own an ENS name, you may use the deployer to set the
resolution address using the `deployer.ens.setAddress` method. You can see an
example of how this is used in the migration file named `3_set_names.js`. Here,
assuming `accounts[0]` owns the names `bob.name` and `alice.name`, we can set
the address to which those names resolve when used in place of an address. Note
that if you are using a local test net, Truffle will automatically give the
necessary permissions for the `from` address to set the resolution address.

After setting the resolution addresses for those names, you can then supply
those names in place of address function arguments and Truffle will
automatically resolve them. You can see examples of this in `test/guestbook.js`
where `bob.name` and `alice.name` are used in several function calls. To read
more about how this works, see the
[ENS docs](https://www.trufflesuite.com/docs/truffle/advanced/ethereum-name-service).

The next highlighted feature in this box is the in-test debugging. This feature
makes the global function `debug()` available in your tests. To see this in
action, go ahead and wrap a function call with this new function. So for
example, in `guestbook.js`, wrap the call to `readMessagesTo` by replacing
```
    const messages = await readMessagesTo(alice);
```
with
```
    const messages = debug(await readMessagesTo(alice));
```

Afterwards, run `truffle test --debug`. It will then start to run the test
suite and start the debugger at that line in the code. You can then use the
debugger controls to step through the code as you would normally!

One last item of note is the use of the new, improved decoder package. For
those of you that want to dig in deeper, check out its uses in `test/helpers.js`.
For even more in-depth information about @truffle/decoder, check out out the
[documentation](https://www.trufflesuite.com/docs/truffle/codec/index.html).
