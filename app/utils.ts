
export const httpError = (reason: string, status: number = 400) => {
  return Response.json({error: reason}, {status})
}

export const sleep = async (seconds: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, seconds * 1000)
  })
}
