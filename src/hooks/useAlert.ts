import { useAlertContext, AlertType } from "context/AlertContext"

export { AlertType }

export function useAlert() {
  const { showAlert, hideAlert } = useAlertContext()
  return [showAlert, hideAlert]
}

export default useAlert
