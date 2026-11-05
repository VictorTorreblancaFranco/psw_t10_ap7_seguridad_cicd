from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


def wait(driver, seconds=10):
    return WebDriverWait(driver, seconds)


def login_as_user(driver, base_url):
    driver.get(f"{base_url}/login")
    driver.find_element(By.ID, "email").send_keys("user@demo.local")
    driver.find_element(By.ID, "password").send_keys("User123!")
    driver.find_element(By.ID, "login-submit").click()
    wait(driver).until(EC.url_contains("/dashboard"))


def test_rechaza_credenciales_invalidas(driver, base_url):
    """CP-SEL-01: el login rechaza credenciales erróneas sin revelar el campo inválido."""
    driver.get(f"{base_url}/login")
    driver.find_element(By.ID, "email").send_keys("user@demo.local")
    driver.find_element(By.ID, "password").send_keys("clave-incorrecta")
    driver.find_element(By.ID, "login-submit").click()

    error = wait(driver).until(EC.visibility_of_element_located((By.ID, "login-error")))
    assert error.text == "Credenciales incorrectas."
    assert "/login" in driver.current_url
    assert driver.execute_script("return sessionStorage.getItem('access_token')") is None
    driver.save_screenshot("/reports/CP-SEL-01-login-invalido.png")


def test_redirige_ruta_protegida_sin_sesion(driver, base_url):
    """CP-SEL-02: una ruta privada no puede abrirse sin una sesión activa."""
    driver.get(f"{base_url}/login")
    driver.execute_script("sessionStorage.clear()")
    driver.get(f"{base_url}/admin")

    wait(driver).until(EC.url_contains("/login"))
    assert driver.find_element(By.CSS_SELECTOR, "[data-testid='login-form']").is_displayed()
    driver.save_screenshot("/reports/CP-SEL-02-ruta-protegida.png")


def test_rechaza_payload_peligroso_en_formulario(driver, base_url):
    """CP-SEL-03: el backend rechaza contenido potencialmente inyectable."""
    login_as_user(driver, base_url)
    driver.get(f"{base_url}/contact")
    driver.find_element(By.ID, "contact-name").send_keys("Victor QA")
    driver.find_element(By.ID, "contact-email").send_keys("victor@example.com")
    driver.find_element(By.ID, "contact-message").send_keys("<script>alert('xss')</script>")
    driver.find_element(By.ID, "contact-submit").click()

    feedback = wait(driver).until(EC.visibility_of_element_located((By.ID, "form-feedback")))
    assert "contenido no permitido" in feedback.text.lower()
    assert not driver.find_elements(By.ID, "admin-authorized")
    driver.save_screenshot("/reports/CP-SEL-03-formulario.png")

