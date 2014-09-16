apparition
==========

[![Build Status](https://travis-ci.org/jagoda/apparition.svg?branch=master)](https://travis-ci.org/jagoda/apparition)

> Environment variable helper utilities.

## Environment

The `Environment` helper provides a managed way to make changes to the process
environment and then roll those changes back at a later point. This is often
useful when testing code that relies on environment variables.

All operations will normalize variable names to upper case. Every method other
than `get()` and `restore()` returns a revert function that can be used to undo
the operation.

### enviroment.delete (name)

| parameter | description                        |
|-----------|------------------------------------|
| name      | the name of the variable to delete |

**returns** a revert function

Unsets a specified environment variable.

### environment.get (name)

| parameter | description                          |
|-----------|--------------------------------------|
| name      | the name of the variable to retrieve |

**returns** the value of the environment variable or `undefined` if not set.

Retrieves a specified environment variable's current value.

### environment.restore ()

Reverts all changes to the environment since the last call to `restore()`.

### environment.set (name, [value])

| parameter | description                        |
|-----------|------------------------------------|
| name      | the name of the variable to update |
| value     | _optional_ the value to set        |

**returns** a revert function

Sets the value of a specified environment variable. If the value is omitted,
this is the same as calling `delete(name)`.
