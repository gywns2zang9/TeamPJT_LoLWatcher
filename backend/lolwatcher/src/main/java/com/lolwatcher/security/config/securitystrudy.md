
`HttpSecurity` 객체는 Spring Security에서 **웹 보안 설정**을 구성할 때 핵심적인 역할을 한다. 이 객체는 애플리케이션의 다양한 보안 정책을 설정하는 데 사용되며, 빌더 패턴을 통해 여러 보안 요소를 단계별로 구성한다. 즉, `HttpSecurity`는 인증, 인가, 세션 관리, CSRF 보호 등 다양한 보안 설정을 제공.

### 1. **HttpSecurity 객체의 역할**
- **웹 애플리케이션의 보안 규칙 설정**: `HttpSecurity`는 애플리케이션에서 어떤 요청이 보호되어야 하고, 어떤 요청이 인증 없이 접근 가능할지를 정의.
- **빌더 패턴을 사용해 체인 형식으로 보안 설정을 쉽게 구성**: 각 보안 요소는 `HttpSecurity`의 메소드로 추가되며, 빌더 패턴을 통해 간결하게 설정할 수 있다.

### 2. **HttpSecurity의 주요 설정 요소**
다음은 `HttpSecurity` 객체에 빌더 패턴으로 설정할 수 있는 주요 보안 요소:

#### 1. **csrf()**:
- **기능**: CSRF 보호를 설정.
- **예시**:
  ```java
  http.csrf().disable();  // CSRF 보호 비활성화
  ```

- **람다로 바꾸면 다음과 같습니다**:
  ```java
  http.csrf(csrf -> csrf.disable());
  ```

#### 2. **authorizeHttpRequests()**:
- **기능**: HTTP 요청에 대한 인증 및 권한 부여 규칙을 설정.
- **예시**:
  ```java
  http.authorizeHttpRequests()
      .requestMatchers("/login", "/css/**").permitAll()  // 특정 경로는 인증 없이 접근 가능
      .anyRequest().authenticated();  // 그 외의 모든 요청은 인증 필요
  ```

- **람다로 바꾸면 다음과 같다**:
  ```java
  http.authorizeHttpRequests(auth -> auth
      .requestMatchers("/login", "/css/**").permitAll()
      .anyRequest().authenticated()
  );
  ```

#### 3. **formLogin()**:
- **기능**: 사용자 정의 로그인 폼을 설정하고, 로그인 성공 시 이동할 경로 등을 설정.
- **예시**:
  ```java
  http.formLogin()
      .loginPage("/login")  // 사용자 정의 로그인 페이지 설정
      .defaultSuccessUrl("/home", true);  // 로그인 성공 후 리디렉션할 경로
  ```

- **람다로 바꾸면 다음과 같다**:
  ```java
  http.formLogin(form -> form
      .loginPage("/login")
      .defaultSuccessUrl("/home", true)
      .permitAll()
  );
  ```

#### 4. **logout()**:
- **기능**: 로그아웃 설정을 구성. 로그아웃 URL, 성공 후 리디렉션 경로 등을 설정.
- **예시**:
  ```java
  http.logout()
      .logoutUrl("/logout")
      .logoutSuccessUrl("/login?logout");  // 로그아웃 후 리디렉션 경로
  ```

- **람다로 바꾸면 다음과 같다**:
  ```java
  http.logout(logout -> logout
      .logoutUrl("/logout")
      .logoutSuccessUrl("/login?logout")
      .permitAll()
  );
  ```

#### 5. **httpBasic()**:
- **기능**: HTTP Basic 인증을 설정.
- **예시**:
  ```java
  http.httpBasic();  // HTTP Basic 인증 활성화
  ```

- **람다로 바꾸면 다음과 같다**:
  ```java
  http.httpBasic(basic -> {});
  ```

#### 6. **sessionManagement()**:
- **기능**: 세션 관리를 설정. 예를 들어, 세션 고정 보호, 세션 정책 등을 설정.
- **예시**:
  ```java
  http.sessionManagement()
      .sessionCreationPolicy(SessionCreationPolicy.STATELESS);  // 세션을 만들지 않고, stateless 방식으로 인증 처리
  ```

- **람다로 바꾸면 다음과 같다**:
  ```java
  http.sessionManagement(session -> session
      .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
  );
  ```

#### 7. **rememberMe()**:
- **기능**: 'Remember-Me' 기능을 설정. 사용자가 다시 로그인하지 않고도 세션을 유지할 수 있도록 설정.
- **예시**:
  ```java
  http.rememberMe()
      .key("uniqueAndSecret")
      .tokenValiditySeconds(86400);  // 1일 동안 Remember-Me 세션 유지
  ```

- **람다로 바꾸면 다음과 같다**:
  ```java
  http.rememberMe(remember -> remember
      .key("uniqueAndSecret")
      .tokenValiditySeconds(86400)
  );
  ```

#### 8. **headers()**:
- **기능**: HTTP 응답 헤더에 대한 보안 설정을 관리.
- **예시**:
  ```java
  http.headers()
      .contentSecurityPolicy("default-src 'self'");  // Content Security Policy 설정
  ```

- **람다로 바꾸면 다음과 같다**:
  ```java
  http.headers(headers -> headers
      .contentSecurityPolicy("default-src 'self'")
  );
  ```

#### 9. **exceptionHandling()**:
- **기능**: 예외 처리 정책을 설정. 예를 들어, 인증되지 않은 사용자가 접근할 때의 처리 등을 설정.
- **예시**:
  ```java
  http.exceptionHandling()
      .accessDeniedPage("/accessDenied");  // 접근 거부 시 리디렉션할 페이지 설정
  ```

- **람다로 바꾸면 다음과 같다**:
  ```java
  http.exceptionHandling(exception -> exception
      .accessDeniedPage("/accessDenied")
  );
  ```

#### 10. **cors()**:
- **기능**: CORS(Cross-Origin Resource Sharing) 설정을 구성.
- **예시**:
  ```java
  http.cors().and();  // CORS 설정 활성화
  ```

- **람다로 바꾸면 다음과 같다**:
  ```java
  http.cors(cors -> {});
  ```

### 3. **빌더 패턴을 통한 체이닝**
`HttpSecurity` 객체의 메소드들은 빌더 패턴을 사용하여 체인 형식으로 호출된다. 즉, 각 메소드는 `HttpSecurity` 객체를 반환하기 때문에, 여러 보안 설정을 한 줄로 연결할 수 있다.

### 4. **정리**
- `HttpSecurity` 객체는 Spring Security에서 **웹 애플리케이션 보안**을 설정하는 데 사용된다.
- 빌더 패턴을 사용하여 여러 보안 요소를 쉽게 추가하고 체인 형식으로 설정할 수 있다.
- 대표적인 설정으로는 CSRF, HTTP 요청 인증, 로그인/로그아웃, 세션 관리, 예외 처리 등이 있다.

이와 같은 요소들이 `HttpSecurity` 객체의 빌더 패턴으로 설정 가능한 내용이다. 각각의 설정을 조합하여 다양한 보안 요구 사항을 충족할 수 있다.