// The following snippet is from:
// https://sergiodxa.com/articles/react/suspense-image-loading/
// A Resource is an object with a read method returning the payload
export interface Resource<Payload> {
  read: () => Payload
}

type status = "pending" | "success" | "error"
export const createResource = <P>(asyncFn: () => Promise<P>): Resource<P> => {
  let status: status = "pending"
  let result: any

  const promise = asyncFn().then(
    (r) => {
      status = "success"
      result = r
    },
    (e) => {
      status = "error"
      result = e
    }
  )
  return {
    read(): P {
      switch (status) {
        case "pending":
          throw promise
        case "error":
          throw result
        case "success":
          return result
      }
    }
  }
}
