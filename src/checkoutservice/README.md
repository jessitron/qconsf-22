# checkoutservice

This one is in golang. Here, the ctx (which is a standard thing in golang) gets passed around everywhere, and the necessary span context is stored there.

## development?

Run the following command to restore dependencies to `vendor/` directory:

```sh
dep ensure --vendor-only
```
