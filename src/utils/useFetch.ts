import React from 'react'

export const useFetch = (url, options, triggerProps: any[] = []) => {
  const [response, setResponse] = React.useState<any>(null)
  const [error, setError] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // const [refetch, setRefetch] = React.useState(null)
  const refetch = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(url, options)
      const json = await response.json()
      setResponse(json)
      setIsLoading(false)
    } catch (error) {
      setError(error)
    }
  }, [url, options])

  React.useEffect(() => {
    refetch()
  }, triggerProps)
  return { response, error, isLoading, refetch }
}
