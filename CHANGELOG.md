# [4.7.4](https://github.com/YanYuanFE/react-native-signature-canvas/compare/v4.1.0...v4.7.4) (2024-12-20)

## 🚀 Major Features

### ✨ WebView Customization
- **NEW**: `webviewProps` parameter for full WebView customization
- **Enhancement**: Smart prop layering - core functionality protected, defaults customizable
- **Improvement**: Platform-specific optimization support

### 🛡️ Advanced Error Handling  
- **NEW**: Automatic error recovery with exponential backoff
- **NEW**: Circuit breaker pattern to prevent cascading failures
- **NEW**: Enhanced error classification and context reporting
- **Enhancement**: User-configurable error callbacks with `onError` prop

### ⚡ Performance Optimizations
- **NEW**: Performance monitoring and automatic optimization
- **NEW**: Memory pressure detection with adaptive settings  
- **Improvement**: Debounced resize handling for smooth interaction
- **Improvement**: Optimized `useMemo` dependencies to reduce re-renders
- **Enhancement**: Device-specific performance configurations

### 🔧 Code Quality Improvements
- **Fix**: Global variable pollution in WebView JavaScript eliminated
- **Fix**: Race condition in save/getData operations resolved
- **Enhancement**: Input validation for all public methods
- **Enhancement**: Enhanced TypeScript definitions with better error types
- **Improvement**: Better null checks and error boundaries

### 🛠️ Developer Experience
- **NEW**: Comprehensive documentation with `WEBVIEW_PROPS.md`
- **NEW**: `QUICK_START.md` guide for rapid setup
- **Enhancement**: Enhanced example applications with best practices
- **Improvement**: Better error messages and debugging information

## 🔧 Bug Fixes
- Fixed memory leaks in event handlers and performance monitoring
- Resolved WebView reload optimization issues  
- Fixed TypeScript definition mismatches (`cropWhitespace` removed)
- Improved message validation and error handling in WebView bridge
- Enhanced cross-platform compatibility

## 📖 Documentation
- Updated README with new features and troubleshooting guide
- Added WebView customization documentation
- Enhanced TypeScript definitions with comprehensive error handling
- Updated package.json with better keywords and description

## 🔄 Migration Guide
This version is **100% backward compatible**. All existing code will continue to work without changes. New features are opt-in via new props.

---

# [4.1.0](https://github.com/YanYuanFE/react-native-signature-canvas/compare/v4.0.0...v4.1.0) (2021-07-14)



# [4.0.0](https://github.com/YanYuanFE/react-native-signature-canvas/compare/3.6.0...v4.0.0) (2021-04-15)


### Bug Fixes

* example ([664ba0c](https://github.com/YanYuanFE/react-native-signature-canvas/commit/664ba0c6a39e5ab476fe94ff9e3c4693ba6f9665))


### Features

* style for view ([439ae9f](https://github.com/YanYuanFE/react-native-signature-canvas/commit/439ae9facba56d6c566dbd96bc0d5e2c8ad51312))



# [3.6.0](https://github.com/YanYuanFE/react-native-signature-canvas/compare/3.5.2...3.6.0) (2021-03-02)



## [3.5.2](https://github.com/YanYuanFE/react-native-signature-canvas/compare/3.5.1...3.5.2) (2021-02-26)



## [3.5.1](https://github.com/YanYuanFE/react-native-signature-canvas/compare/v3.3.0...3.5.1) (2021-02-18)


### Bug Fixes

* add dataUrl to deps ([45f8c95](https://github.com/YanYuanFE/react-native-signature-canvas/commit/45f8c950591008bd8fbd21333b5db8a59108c618))



# [3.3.0](https://github.com/YanYuanFE/react-native-signature-canvas/compare/v3.2.0...v3.3.0) (2020-11-13)


### Bug Fixes

* example ([0d36f57](https://github.com/YanYuanFE/react-native-signature-canvas/commit/0d36f571461501fcfd392d4449e8a786314a576f))
* example ([5287173](https://github.com/YanYuanFE/react-native-signature-canvas/commit/52871730d0fcfcc5a65fd984ea0d019aef87a051))


### Features

* v3.3.0 ([5d8cae2](https://github.com/YanYuanFE/react-native-signature-canvas/commit/5d8cae2863518979532d6679b700719ec702bddd))



# [3.2.0](https://github.com/YanYuanFE/react-native-signature-canvas/compare/v3.1.0...v3.2.0) (2020-10-07)


### Bug Fixes

* example ([4d44f94](https://github.com/YanYuanFE/react-native-signature-canvas/commit/4d44f94abd578562093ae0f261ee623a6039a06f))
* jpg example ([aaa12ee](https://github.com/YanYuanFE/react-native-signature-canvas/commit/aaa12eeb3a101fa7c59a8affcd515d499d966577))


### Features

* minSize and dotSize prop ([d6804ab](https://github.com/YanYuanFE/react-native-signature-canvas/commit/d6804ab28c54144c77d9e95cc3a1bc0f5a183676))



# [3.1.0](https://github.com/YanYuanFE/react-native-signature-canvas/compare/bab55a690721a244aacdd43944e112a7ee801126...v3.1.0) (2020-07-31)


### Bug Fixes

* 1.7.1 ([f535ecf](https://github.com/YanYuanFE/react-native-signature-canvas/commit/f535ecfa70bb8d5ebbd54de764d9b9b72ccddb09))
* add expo v36 example ([92125cc](https://github.com/YanYuanFE/react-native-signature-canvas/commit/92125ccbc8005e58a5ee720fb2d19eb5750ac4cd))
* example ([3183dfd](https://github.com/YanYuanFE/react-native-signature-canvas/commit/3183dfdd892275bc39f2304d27a72f71d4b8c06e))
* example ([c8ca4b5](https://github.com/YanYuanFE/react-native-signature-canvas/commit/c8ca4b5f9a09bf5fa105a4505f40faa036bd064a))
* fix ios error after click save button ([1a54e79](https://github.com/YanYuanFE/react-native-signature-canvas/commit/1a54e797b4847cd4d870f190bdc8de30ef17d507))
* fix let ([ae68a3d](https://github.com/YanYuanFE/react-native-signature-canvas/commit/ae68a3d6a69bdbce17b19bd6c0d19fb1eccc5b74))
* fix sign not work of empty text ([a61fe02](https://github.com/YanYuanFE/react-native-signature-canvas/commit/a61fe0229a5fc5729ff7c235acc3eb169324fce3))
* fix signature clear after canvas resize ([c09bd62](https://github.com/YanYuanFE/react-native-signature-canvas/commit/c09bd625860ce17d0a5c8ae9a6da7e16347c95bf))
* onOK ([4402729](https://github.com/YanYuanFE/react-native-signature-canvas/commit/44027299174f2829955572528cd908d9eb182fff))
* publish config ([1737819](https://github.com/YanYuanFE/react-native-signature-canvas/commit/173781946673cd1381ede42e142f108fd60d3a38))
* update example version ([7796319](https://github.com/YanYuanFE/react-native-signature-canvas/commit/779631975fedc3dbbfdb7f42e67c0472382b70fb))
* update exampleApp ([5ad69ff](https://github.com/YanYuanFE/react-native-signature-canvas/commit/5ad69ff60248bc94618ff99ec9badd986498b6a9))
* update react-native-webview ([be5c8ef](https://github.com/YanYuanFE/react-native-signature-canvas/commit/be5c8efa835e4cd81a016b173c2d2cf27d15cb75))
* update react-native-webview ([587f005](https://github.com/YanYuanFE/react-native-signature-canvas/commit/587f0053c5170f8d05bfd0040597a075df0b5905))
* v3.0 ([f4295f3](https://github.com/YanYuanFE/react-native-signature-canvas/commit/f4295f37d9e33d6e6b7281458bf20dc974a49993))


### Features

* add auto clear props ([2ed6a9a](https://github.com/YanYuanFE/react-native-signature-canvas/commit/2ed6a9a268ad6e328848228fa18ffca233f557eb))
* add dataURL prop ([d58a655](https://github.com/YanYuanFE/react-native-signature-canvas/commit/d58a655df9e0b0bbb9235474f0b5cc62fd517e42))
* add example ([bab55a6](https://github.com/YanYuanFE/react-native-signature-canvas/commit/bab55a690721a244aacdd43944e112a7ee801126))
* add onEmpty props ([7451993](https://github.com/YanYuanFE/react-native-signature-canvas/commit/745199311af53efb11c79b3afae1d6762ee4b0a1))
* add penColor and backgroundColor ([652e7ec](https://github.com/YanYuanFE/react-native-signature-canvas/commit/652e7ec8a7bb552517376fc3ea72401118c782f7))
* add penColor and backgroundColor ([29a7df0](https://github.com/YanYuanFE/react-native-signature-canvas/commit/29a7df01823c17e281c792847d6ef51acab91c53))
* add typescript types and support ([aed3273](https://github.com/YanYuanFE/react-native-signature-canvas/commit/aed3273252cb9bde771a796c3e5fc90d550564b2))
* onClear props ([9fbcb94](https://github.com/YanYuanFE/react-native-signature-canvas/commit/9fbcb943a9160e45f622e637f2a664e21fde4956))
* publish 1.7.0 ([4f4e371](https://github.com/YanYuanFE/react-native-signature-canvas/commit/4f4e371d809236b914bb8763e91b045abeb407d4))
* publish v1.8.0 ([81dfa14](https://github.com/YanYuanFE/react-native-signature-canvas/commit/81dfa14f8c4c73a1288d7a92b10189f05dbeb33e))
* release v1.5.0, use react-native-webview ([1c15588](https://github.com/YanYuanFE/react-native-signature-canvas/commit/1c15588546aace8ed0cb46a76e76b698422a0b57))
* update example deps ([2d7b7bd](https://github.com/YanYuanFE/react-native-signature-canvas/commit/2d7b7bd81a78228ed1634582f70634ad1917f9ac))
* update react-native-webview ([10d7392](https://github.com/YanYuanFE/react-native-signature-canvas/commit/10d73929fba21ed8771efb3be2575b68ebade6f8))
* update signature_pad.js, add imageType ([88cf6b6](https://github.com/YanYuanFE/react-native-signature-canvas/commit/88cf6b6b025fa5c9f58d5366e41828d078e4fcbc))
* v1.9.0 ([834094d](https://github.com/YanYuanFE/react-native-signature-canvas/commit/834094dc34b7469319ded1cf4a2f7d25b275f16a))



