import { Component } from "react";

export default class CompareErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Compare render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300 text-sm">
          ⚠️ Error al mostrar este bloque: {this.state.error?.message}
        </div>
      );
    }
    return this.props.children;
  }
}