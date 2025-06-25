/* eslint-disable @typescript-eslint/no-explicit-any */

export function thisBind<T extends { new (...args: any[]): any }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      
      // 프로토타입 메서드 바인딩
      const methodNames = Object.getOwnPropertyNames(constructor.prototype)
        .filter(name => 
          name !== 'constructor' && 
          typeof constructor.prototype[name] === 'function'
        );
      
      for (const methodName of methodNames) {
        // 중요: 속성 getter를 만들어 항상 바인딩된 함수 반환
        Object.defineProperty(this, methodName, {
          get: function() {
            // 항상 현재 인스턴스에 바인딩된 함수를 반환
            return constructor.prototype[methodName].bind(this);
          },
          configurable: true,
          enumerable: true
        });
      }
      
      // 인스턴스 속성 처리 (화살표 함수 + 일반 함수 속성)
      const propertyNames = Object.getOwnPropertyNames(this);
      
      for (const key of propertyNames) {
        const descriptor = Object.getOwnPropertyDescriptor(this, key);
        const isMethod = descriptor && typeof descriptor.value === 'function';
        
        if (isMethod) {
          // 화살표 함수 속성은 이미 this가 바인딩되어 있으므로 추가 작업 불필요
          // prototype이 없는 함수는 화살표 함수로 간주
          if (!descriptor!.value.prototype) {
            continue;
          }
          
          // 일반 함수 속성에 this 바인딩
          Object.defineProperty(this, key, {
            value: descriptor!.value.bind(this),
            enumerable: descriptor!.enumerable,
            configurable: descriptor!.configurable,
            writable: descriptor!.writable
          });
        }
      }
    }
  };
}