export const getAppByName = (apps, appName) => {
  if (apps) return apps.find(app => app.name === appName)
}
